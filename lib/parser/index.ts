import fs from 'fs';
import csv from 'csv-parser';

import { isAnthemClaim, parseAnthemClaim } from './anthem';

import type Claim from 'lib/db/entities/claim';

type RawClaim = Record< string, string >;

function readCSV( csvPath: string ): Promise< RawClaim[] > {
	const rawClaims: RawClaim[] = [];
	const stream = fs.createReadStream( csvPath )
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

export default async function parseCSV( csvPath: string ): Promise< Claim[] > {
	const rawClaims = await readCSV( csvPath );
	return rawClaims.map( ( rawClaim ) => {
		if ( isAnthemClaim( rawClaim ) ) {
			return parseAnthemClaim( rawClaim );
		}
		throw new Error( 'Unknown claim type found!' );
	} );
}
