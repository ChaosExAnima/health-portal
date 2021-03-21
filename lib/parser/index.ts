import { createHash } from 'crypto';
import csv from 'csv-parser';
import { DeepPartial, EntityManager, In } from 'typeorm';

import {
	getProviderFromClaim,
	isAnthemClaim,
	parseAnthemClaim,
} from './anthem';
import { slugify } from 'lib/strings';

import type { Readable } from 'stream';
import { Claim, Import, Provider } from 'lib/db/entities';
import { isTestClaim, parseTestClaim } from './test-utils';
import dayjs from 'dayjs';

type RawClaim = Record< string, string >;
type MaybeArray< T > = T | T[];

export function readCSV( readStream: Readable ): Promise< RawClaim[] > {
	const rawClaims: RawClaim[] = [];
	const stream = readStream
		.pipe( csv() )
		.on( 'data', ( data ) => rawClaims.push( data ) );
	return new Promise( ( res, rej ) => {
		stream.on( 'end', () => {
			stream.end();
			res( rawClaims );
		} );
		stream.on( 'error', rej );
	} );
}

export function isClaimSame( newClaim: Claim, oldClaim?: Claim ): boolean {
	return (
		!! oldClaim &&
		newClaim.number === oldClaim.number &&
		newClaim.status === oldClaim.status &&
		dayjs( newClaim.serviceDate ).isSame( oldClaim.serviceDate ) &&
		newClaim.type === oldClaim.type &&
		newClaim.billed === oldClaim.billed &&
		newClaim.cost === oldClaim.cost
	);
}

export function getHash(
	input: MaybeArray< Record< string, unknown > >,
	end?: number
): string {
	const hash = createHash( 'md5' );
	hash.update( JSON.stringify( input ) );
	const digest = hash.digest( 'hex' );
	return end ? digest.slice( 0, end ) : digest;
}

export function getUniqueSlug( parentSlug: string ): string {
	const matches = parentSlug.match( /^([a-z0-9-]+)-?(\d+)?$/i );
	if ( ! matches ) {
		throw new Error( 'No slug provided.' );
	} else if ( matches.length === 1 ) {
		return `${ matches[ 0 ] }-1`;
	}
	return `${ matches[ 0 ] }-${ Number.parseInt( matches[ 1 ] ) + 1 }`;
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
	await providerRepo.save( newProviders );
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
		claim.import = Promise.resolve( importEntity );
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
	const upsertClaims: Claim[] = [];
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
		if ( isClaimSame( claim, oldClaim ) ) {
			continue;
		}
		if ( oldClaim ) {
			oldClaim.parent = Promise.resolve( claim );
			upsertClaims.push( oldClaim );
			updated++;
		} else {
			inserted++;
		}
		claim.slug = getUniqueSlug( oldClaim?.slug || claim.number );
		claim.import = Promise.resolve( importEntity );
		upsertClaims.push( claim );
	}

	if ( upsertClaims.length ) {
		// Insert new claims and set IDs for prior claims.
		await claimRepo.save( upsertClaims );
	}
	return { inserted, updated };
}

export default async function parseCSV(
	readStream: Readable,
	em: EntityManager
): Promise< number > {
	// Read CSV and check if this is a dupe.
	const rawClaims: RawClaim[] = await readCSV( readStream );
	const importEntity = await getImportOrThrow( rawClaims, em );

	const providers = await getAndInsertProviders(
		rawClaims,
		em,
		importEntity
	);

	// Extract claim data.
	const { inserted, updated } = await saveClaims(
		rawClaims,
		providers,
		importEntity,
		em
	);
	importEntity.inserted = inserted;
	importEntity.updated = updated;
	await importEntity.save();

	return inserted;
}
