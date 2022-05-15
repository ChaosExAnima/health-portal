import csv from 'csv-parser';
import debug from 'debug';

import * as constants from 'lib/constants';
import getDB from 'lib/db';
import { queryMeta } from 'lib/db/helpers';
import { slugify } from 'lib/strings';

import {
	getProviderFromClaim,
	isAnthemClaim,
	parseAnthemClaim,
} from './anthem';
import {
	getProviderFromTestClaim,
	isTestClaim,
	parseTestClaim,
} from './test-utils';
import { getHash } from './utils';

import type { RawClaim, RawData } from './types';
import type { Nullable } from 'global-types';
import type { Knex } from 'knex';
import type { ContentDB, ImportDB, ProviderDB } from 'lib/db/types';
import type { Readable } from 'stream';

const log = debug( 'app:parser' );

export function readCSV( readStream: Readable ): Promise< RawData[] > {
	const rawClaims: RawData[] = [];
	const stream = readStream
		.pipe( csv( { strict: true } ) )
		.on( 'data', ( data ) => rawClaims.push( data ) );
	return new Promise( ( res, rej ) => {
		stream.on( 'end', () => {
			stream.end();
			res( rawClaims );
		} );
		stream.on( 'error', rej );
	} );
}

export async function getAndInsertProviders(
	rawClaims: RawData[],
	importEntity: ImportDB,
	trx: Knex.Transaction
): Promise< ProviderDB[] > {
	// Get all provider slugs.
	const providerRows = await trx( constants.TABLE_PROVIDERS ).select(
		'slug'
	);
	const providerSlugs = providerRows.map( ( { slug } ) => slug );

	// Iterate over all claims and determines new ones.
	for ( const rawClaim of rawClaims ) {
		// Filter out existing data.
		let name = '';
		if ( isAnthemClaim( rawClaim ) ) {
			name = getProviderFromClaim( rawClaim );
		} else if ( isTestClaim( rawClaim ) ) {
			name = getProviderFromTestClaim( rawClaim );
		} else {
			continue;
		}

		// Checks if the name is included.
		const slug = slugify( name );
		if ( ! slug || providerSlugs.includes( slug ) ) {
			continue;
		}

		// Create a new provider and add it to array to be created.
		const newProviderId = await trx(
			constants.TABLE_PROVIDERS
		).insert< number >( {
			slug: slugify( name ),
			name,
			importId: importEntity.id,
		} );
		const newProvider = await trx( constants.TABLE_PROVIDERS )
			.where( 'id', newProviderId )
			.first();
		if ( ! newProvider ) {
			throw new Error( 'Could not insert provider row' );
		}
		providerSlugs.push( newProvider.slug );
	}
	return trx( constants.TABLE_PROVIDERS );
}

export async function getImportOrThrow(
	rawClaims: RawData[],
	trx: Knex.Transaction
): Promise< ImportDB > {
	const claimsHash = getHash( rawClaims );
	const existingImport = await trx( constants.TABLE_IMPORTS )
		.where( 'hash', claimsHash )
		.first();
	if ( existingImport ) {
		throw new Error( 'Claims have been previously uploaded' );
	}
	const importId = await trx( constants.TABLE_IMPORTS )
		.insert( {
			hash: claimsHash,
		} )
		.first();
	if ( ! importId ) {
		throw new Error( 'Could not insert new import row' );
	}
	const newImport = await trx( constants.TABLE_IMPORTS )
		.where( 'id', importId )
		.first();
	if ( ! newImport ) {
		throw new Error( 'Could not insert new import row' );
	}
	return newImport;
}

function providerNameToId(
	name: Nullable< string >,
	providers: ProviderDB[]
): Nullable< number > {
	if ( ! name ) {
		return null;
	}
	const provider = providers.find( ( { slug } ) => slug === slugify( name ) );
	if ( ! provider ) {
		return null;
	}
	return provider.id;
}

export async function saveClaims(
	rawClaims: RawData[],
	providers: ProviderDB[],
	importEntity: ImportDB,
	trx: Knex.Transaction
): Promise< { inserted: number; updated: number } > {
	let inserted = 0;
	let updated = 0;
	const oldClaims = await trx( constants.TABLE_CONTENT ).where(
		'type',
		constants.CONTENT_CLAIM
	);

	for ( const rawClaim of rawClaims ) {
		// Get claim data from raw CSV row.
		let claimData: Nullable< RawClaim > = null;
		if ( isAnthemClaim( rawClaim ) ) {
			claimData = parseAnthemClaim( rawClaim );
		} else if ( isTestClaim( rawClaim ) ) {
			claimData = parseTestClaim( rawClaim );
		}
		if ( ! claimData ) {
			throw new Error( 'Unknown claim type found!' );
		} else if ( ! claimData.number ) {
			throw new Error( 'Number field required' );
		}

		// Updates DB.
		const contentData: Omit< ContentDB, 'id' > = {
			identifier: slugify( claimData.number ),
			created: claimData.created,
			type: constants.CONTENT_CLAIM,
			status: claimData.status,
			info: claimData.type,
			importId: importEntity.id,
			providerId: providerNameToId( claimData.providerName, providers ),
		};
		const oldClaim = oldClaims.find(
			( { identifier } ) =>
				slugify( contentData.identifier ) === identifier
		);
		if ( ! oldClaim ) {
			const newClaimId = await trx( constants.TABLE_CONTENT )
				.insert( contentData )
				.first();
			if ( newClaimId ) {
				await trx( constants.TABLE_META ).insert( [
					{
						contentId: newClaimId,
						key: 'billed',
						value: claimData.billed.toString(),
					},
					{
						contentId: newClaimId,
						key: 'cost',
						value: claimData.cost.toString(),
					},
				] );
				inserted++;
			}
		} else {
			await trx( constants.TABLE_CONTENT ).update( {
				id: oldClaim.id,
				...contentData,
			} );
			const meta = await queryMeta( oldClaim.id );
			await trx( constants.TABLE_META ).update( [
				{
					id: meta.find( ( { key } ) => key === 'billed' )?.id,
					contentId: oldClaim.id,
					key: 'billed',
					value: claimData.billed.toString(),
				},
				{
					id: meta.find( ( { key } ) => key === 'cost' )?.id,
					contentId: oldClaim.id,
					key: 'cost',
					value: claimData.cost.toString(),
				},
			] );
			updated++;
		}
	}

	return { inserted, updated };
}

export default async function parseCSV(
	readStream: Readable
): Promise< number > {
	let returnVal = 0;
	log( '===== Starting import' );
	const knex = getDB();
	await knex.transaction( async ( trx ) => {
		let providers: ProviderDB[];
		let rawClaims: RawData[];
		try {
			rawClaims = await readCSV( readStream );
			log( 'Read CSV' );
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing CSV' );
		}
		const importEntity = await getImportOrThrow( rawClaims, trx );
		log( 'Saved import to DB' );

		try {
			providers = await getAndInsertProviders(
				rawClaims,
				importEntity,
				trx
			);
			log( 'Inserted providers' );
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing providers' );
		}

		// Extract claim data.
		try {
			const { inserted, updated } = await saveClaims(
				rawClaims,
				providers,
				importEntity,
				trx
			);
			returnVal = inserted + updated;
			log( 'Inserted and updated claims' );
			await trx( constants.TABLE_IMPORTS ).update( {
				id: importEntity.id,
				inserted,
				updated,
			} );
			log( 'Saves totals to import table' );
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing claims' );
		}
	} );

	return returnVal;
}
