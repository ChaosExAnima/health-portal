import { Readable } from 'stream';

import * as constants from 'lib/constants';
import { inReadonlyArray } from 'lib/entities/utils';

import type { RawClaim } from './types';

type RawTestRow =
	| {
			number: string;
			status: string;
			type: string;
			serviceDate: string;
			billed: string;
			cost: string;
			provider?: string;
	  }
	| { provider: string };

export function isTestClaim(
	rawClaim: Record< string, string | undefined >
): rawClaim is RawTestRow {
	return (
		( 'number' in rawClaim &&
			'status' in rawClaim &&
			'serviceDate' in rawClaim &&
			'type' in rawClaim &&
			'billed' in rawClaim &&
			'cost' in rawClaim ) ||
		'provider' in rawClaim
	);
}

export function getProviderFromTestClaim( rawClaim: RawTestRow ): string {
	if ( ! ( 'provider' in rawClaim ) || ! rawClaim.provider ) {
		throw new Error( 'Invalid test claim type' );
	}
	return rawClaim.provider;
}

export function parseTestClaim( rawClaim: RawTestRow ): RawClaim {
	if ( ! ( 'serviceDate' in rawClaim ) ) {
		throw new Error( 'Invalid test claim type' );
	}

	return {
		number: rawClaim.number,
		created: new Date( rawClaim.serviceDate ),
		billed: Number.parseFloat( rawClaim.billed ),
		cost: Number.parseFloat( rawClaim.cost ),
		providerName: rawClaim.provider || 'Unknown',
		type: inReadonlyArray(
			rawClaim.type,
			constants.CLAIM_TYPES,
			constants.CLAIM_TYPE_OTHER
		),
		status: inReadonlyArray(
			rawClaim.status,
			constants.CLAIM_STATUSES,
			constants.CLAIM_STATUS_UNKNOWN
		),
	};
}

export function arrToCSVStream( ...rows: string[][] ): Readable {
	return Readable.from(
		rows.map( ( row ) => `"${ row.join( '","' ) }"` ).join( '\n' )
	);
}

export const baseClaim = {
	number: '1234',
	status: 'pending',
	type: 'test',
	slug: 'test',
	serviceDate: new Date( 2021, 0, 1, 12 ),
	billed: 1.23,
	cost: 1.23,
} as const;
