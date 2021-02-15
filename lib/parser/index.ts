import csv from 'csv-parser';
import { In } from 'typeorm';

import {
	getProviderFromAnthemClaim,
	isAnthemClaim,
	parseAnthemClaim,
} from './anthem';
import { query } from 'lib/db';

import type { ReadStream } from 'fs';
import type { Claim, Provider } from 'lib/db/entities';

type RawClaim = Record< string, string >;

function readCSV( readStream: ReadStream ): Promise< RawClaim[] > {
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

function isClaimSame( newClaim: Claim, oldClaim?: Claim ): boolean {
	return (
		!! oldClaim &&
		newClaim.number === oldClaim.number &&
		newClaim.status === oldClaim.status &&
		newClaim.type === oldClaim.type &&
		newClaim.billed === oldClaim.billed &&
		newClaim.cost === oldClaim.cost
	);
}

async function getProviders( rawClaims: RawClaim[] ): Promise< Provider[] > {
	const providers = [];
	for ( const rawClaim of rawClaims ) {
		if ( isAnthemClaim( rawClaim ) ) {
			const maybeProvider = await getProviderFromAnthemClaim( rawClaim );
			if ( maybeProvider ) {
				providers.push( maybeProvider );
			}
		}
	}
	return providers;
}

export default async function parseCSV( readStream: ReadStream ): Promise< Claim[] > {
	const em = await query();
	const rawClaims = await readCSV( readStream );
	const providers = await getProviders( rawClaims );
	const claims = await Promise.all( rawClaims.map( ( rawClaim ) => {
		if ( isAnthemClaim( rawClaim ) ) {
			return parseAnthemClaim( rawClaim, providers );
		}
		throw new Error( 'Unknown claim type found!' );
	} ) );

	const oldClaims = await em.find< Claim >(
		'Claim',
		{ where: { parent: null, number: In( claims.map( ( { number } ) => number ) ) } }
	);

	if ( ! oldClaims.length ) {
		return Promise.all( claims.map( ( claim ) => claim.save() ) );
	}

	const newClaims = [];
	for ( let claim of claims ) {
		const oldClaim = oldClaims.find( ( { number } ) => claim.number === number );
		if ( isClaimSame( claim, oldClaim ) ) {
			continue;
		}
		claim = await claim.save();
		if ( oldClaim ) {
			oldClaim.parent = Promise.resolve( claim );
			await claim.save();
		}
		newClaims.push( claim );
	}

	return claims;
}
