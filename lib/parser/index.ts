import { createHash } from 'crypto';
import csv from 'csv-parser';
import { EntityManager, In } from 'typeorm';

import {
	getProviderFromClaim,
	isAnthemClaim,
	parseAnthemClaim,
} from './anthem';
import { slugify } from 'lib/strings';

import type { Readable } from 'stream';
import { Claim, Import, Provider } from 'lib/db/entities';

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
	return !! oldClaim && newClaim.slug === oldClaim.slug;
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
		let claim: Claim | undefined;
		if ( isAnthemClaim( rawClaim ) ) {
			claim = claimRepo.create( parseAnthemClaim( rawClaim, providers ) );
		}

		if ( claim ) {
			claim.import = Promise.resolve( importEntity );
			return claim;
		}
		throw new Error( 'Unknown claim type found!' );
	} );

	// Get all old claims.
	const oldClaims = await claimRepo.find( {
		select: [ 'id', 'number' ],
		where: {
			parent: null,
			number: In( claims.map( ( { number } ) => number ) ),
		},
	} );

	// Insert it all and exit.
	if ( ! oldClaims.length ) {
		await claimRepo.insert( claims );
		return {
			inserted: claims.length,
			updated: 0,
		};
	}

	// Iterate over claims and find new ones.
	let newClaims: Claim[] = [];
	for ( const claim of claims ) {
		const oldClaim = oldClaims.find(
			( { number } ) => claim.number === number
		);
		if ( isClaimSame( claim, oldClaim ) ) {
			continue;
		}
		claim.import = Promise.resolve( importEntity );
		newClaims.push( claim );
	}

	// Insert new claims and set IDs for prior claims.
	newClaims = await claimRepo.save( newClaims );

	let inserted = 0;
	let updated = 0;
	for ( const newClaim of newClaims ) {
		const oldRootClaim = oldClaims.find(
			( { slug } ) => newClaim.slug === slug
		);
		if ( ! oldRootClaim ) {
			inserted++;
			continue; // Completely new claim.
		}
		await claimRepo.update( oldRootClaim.id, {
			parent: Promise.resolve( newClaim ),
		} );
		updated++;
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
