import dayjs from 'dayjs';

import * as constants from 'lib/constants';
import { priceToNumber } from 'lib/strings';

import { RawClaim } from './types';

type RawAnthemRow = {
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
): claim is RawAnthemRow {
	return 'Claim Received' in claim;
}

export function getProviderFromClaim( rawClaim: RawAnthemRow ): string {
	return rawClaim[ 'Provided By' ];
}

export function parseAnthemClaim( rawClaim: RawAnthemRow ): RawClaim {
	let status: constants.CLAIM_STATUS_TYPE = constants.CLAIM_STATUS_UNKNOWN;
	if ( rawClaim.Status ) {
		if ( rawClaim.Status === 'Approved' ) {
			status = constants.CLAIM_STATUS_APPROVED;
		} else if ( rawClaim.Status === 'Denied' ) {
			status = constants.CLAIM_STATUS_DENIED;
		} else if ( rawClaim.Status === 'Pending' ) {
			status = constants.CLAIM_STATUS_PENDING;
		}
	}

	return {
		number: rawClaim[ 'Claim Number' ],
		type:
			rawClaim[ 'Claim Type' ] === 'Pharmacy'
				? constants.CLAIM_TYPE_MEDS
				: constants.CLAIM_TYPE_IN,
		created: dayjs( rawClaim[ 'Service Date' ] ).toDate(),
		status,
		providerName: getProviderFromClaim( rawClaim ),
		billed: priceToNumber( rawClaim.Billed ) || 0,
		cost: priceToNumber( rawClaim[ 'Your Cost' ] ) || 0,
	};
}
