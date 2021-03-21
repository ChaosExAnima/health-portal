import csv from 'csv-parser';
import { DeepPartial, EntityManager, In } from 'typeorm';
import debug from 'debug';

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
import { Claim, Import, Provider } from 'lib/db/entities';
import { slugify } from 'lib/strings';

import type { Readable } from 'stream';
import { getHash, getUniqueSlug, isClaimSame } from './utils';

type RawClaim = Record< string, string >;

const log = debug( 'app:parser' );

export function readCSV( readStream: Readable ): Promise< RawClaim[] > {
	const rawClaims: RawClaim[] = [];
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
	rawClaims: RawClaim[],
	em: EntityManager,
	importEntity: Import
): Promise< Provider[] > {
	const providerRepo = em.getRepository< Provider >( 'Provider' );

	// Get all provider slugs.
	const providerNames = await (
		await providerRepo.find( { select: [ 'name' ] } )
	 ).map( ( { name } ) => name );

	// Iterate over all claims and determines new ones.
	const newProviders: Provider[] = [];
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
		name = name.trim();
		if ( ! name || providerNames.includes( name ) ) {
			continue;
		}

		// Create a new provider and add it to array to be created.
		const newProvider = providerRepo.create( {
			slug: slugify( name ),
			name,
		} );
		newProvider.import = Promise.resolve( importEntity );
		providerNames.push( name );
		newProviders.push( newProvider );
	}
	if ( newProviders.length ) {
		await providerRepo.save( newProviders );
	}
	return providerRepo.find();
}

export async function getImportOrThrow(
	rawClaims: RawClaim[],
	em: EntityManager
): Promise< Import > {
	const claimsHash = getHash( rawClaims );
	const importRepo = em.getRepository< Import >( 'Import' );
	if ( await importRepo.findOne( { where: { hash: claimsHash } } ) ) {
		throw new Error( 'Claims have been previously uploaded' );
	}
	return importRepo.save( {
		hash: claimsHash,
	} );
}

export async function saveClaims(
	rawClaims: RawClaim[],
	providers: Provider[],
	importEntity: Import,
	em: EntityManager
): Promise< { inserted: number; updated: number } > {
	const claimRepo = em.getRepository< Claim >( 'Claim' );
	const claims = rawClaims.map( ( rawClaim ) => {
		let claimData: DeepPartial< Claim > | undefined;
		if ( isAnthemClaim( rawClaim ) ) {
			claimData = parseAnthemClaim( rawClaim, providers );
		} else if ( isTestClaim( rawClaim ) ) {
			claimData = parseTestClaim( rawClaim );
		}
		if ( ! claimData ) {
			throw new Error( 'Unknown claim type found!' );
		} else if ( ! claimData.number ) {
			throw new Error( 'Number field required' );
		}
		const claim = claimRepo.create( claimData );
		if ( claimData.provider ) {
			claim.provider = claimData.provider as Promise< Provider >;
		}
		return claim;
	} );

	// Get all old claims.
	const oldClaims = await claimRepo.find( {
		where: {
			parent: null,
			number: In( claims.map( ( { number } ) => number ) ),
		},
	} );

	// Iterate over claims and generate list of changed claims.
	const insertClaims: Claim[] = [];
	const parentClaims: Claim[] = [];
	const claimNumbers: string[] = [];
	let inserted = 0;
	let updated = 0;
	for ( const claim of claims ) {
		if ( claimNumbers.includes( claim.number ) ) {
			continue;
		}
		claimNumbers.push( claim.number );

		const oldClaim = oldClaims.find(
			( { number } ) => claim.number === number
		);
		if ( oldClaim ) {
			if ( isClaimSame( claim, oldClaim ) ) {
				continue;
			}
			parentClaims.push( oldClaim );
			updated++;
		} else {
			inserted++;
		}
		claim.slug = getUniqueSlug( oldClaim?.slug || claim.number );
		claim.import = Promise.resolve( importEntity );

		insertClaims.push( claim );
	}

	// Write to DB.
	if ( insertClaims.length ) {
		log( 'Saving new claims' );
		await claimRepo.save( insertClaims );

		log( 'Updating parent claims' );
		for ( const oldClaim of parentClaims ) {
			const newClaim = insertClaims.find(
				( { number } ) => oldClaim.number === number
			);
			if ( newClaim ) {
				oldClaim.parent = Promise.resolve( newClaim );
			}
		}
		await claimRepo.save( oldClaims );
	}
	const importRepo = em.getRepository< Import >( 'Import' );
	importRepo.update( importEntity, { inserted, updated } );

	return { inserted, updated };
}

export default async function parseCSV(
	readStream: Readable,
	em: EntityManager
): Promise< number > {
	let returnVal = 0;
	log( '===== Starting import' );
	await em.transaction( async ( emt ) => {
		let providers;
		let rawClaims: RawClaim[];
		try {
			rawClaims = await readCSV( readStream );
			log( 'Read CSV' );
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing CSV' );
		}
		const importEntity = await getImportOrThrow( rawClaims, emt );
		log( 'Saved import to DB' );

		try {
			providers = await getAndInsertProviders(
				rawClaims,
				emt,
				importEntity
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
				emt
			);
			log( 'Inserted and updated claims' );
			returnVal = inserted + updated;
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing claims' );
		}
	} );

	return returnVal;
}
