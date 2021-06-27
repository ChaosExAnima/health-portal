import dayjs from 'dayjs';
import { priceToNumber, slugify } from 'lib/strings';

import type { Claim, Provider } from 'lib/db/entities';
import type { DeepPartial } from 'typeorm';

type RawClaim = {
	'Claim Type': string;
	'Claim Number': string;
	Patient: string;
	'Service Date': string;
	'Claim Received': string;
	Status: string;
	'Processed Date': string;
	'Provided By': string;
	Billed: string;
	'Allowed Amount': string;
	Paid: string;
	Deductible: string;
	Coinsurance: string;
	Copay: string;
	'Not covered': string;
	'Your Cost': string;
};

export function isAnthemClaim(
	claim: Record< string, string >
): claim is RawClaim {
	return 'Claim Received' in claim;
}

export function getProviderFromClaim( rawClaim: RawClaim ): string {
	return rawClaim[ 'Provided By' ];
}

export function parseAnthemClaim( rawClaim: RawClaim ): DeepPartial< Claim > {
	let status = 'PENDING';
	if ( rawClaim.Status ) {
		if ( rawClaim.Status === 'Approved' ) {
			status = 'APPROVED';
		} else if ( rawClaim.Status === 'Denied' ) {
			status = 'DENIED';
		}
	}

	return {
		number: rawClaim[ 'Claim Number' ],
		slug: slugify( rawClaim[ 'Claim Number' ] || '' ),
		type:
			rawClaim[ 'Claim Type' ] === 'Pharmacy' ? 'PHARMACY' : 'INNETWORK',
		serviceDate: dayjs( rawClaim[ 'Service Date' ] ).toDate(),
		status,
		billed: priceToNumber( rawClaim.Billed ) || 0,
		cost: priceToNumber( rawClaim[ 'Your Cost' ] ) || 0,
	};
}
