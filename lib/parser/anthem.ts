import dayjs from 'dayjs';

import Claim from 'lib/db/entities/claim';
import { priceToNumber } from 'lib/strings';

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
}

export function isAnthemClaim( claim: Record< string, string > ): boolean {
	return 'Claim Recieved' in claim;
}

export function parseAnthemClaim( rawClaim: Partial< RawClaim > ): Claim {
	let status = 'pending';
	if ( rawClaim.Status ) {
		if ( rawClaim.Status === 'Approved' ) {
			status = 'approved';
		} else if ( rawClaim.Status === 'Denied' ) {
			status = 'denied';
		}
	}

	const claim = new Claim();
	claim.number = rawClaim[ 'Claim Number' ];
	claim.type = rawClaim[ 'Claim Type' ] === 'Pharmacy' ? 'pharmacy' : 'medical';
	claim.serviceDate = dayjs( rawClaim[ 'Service Date' ] ).toDate();
	claim.status = status;
	claim.billed = priceToNumber( rawClaim.Billed ) || 0;
	claim.cost = priceToNumber( rawClaim[ 'Your Cost' ] ) || 0;
	return claim;
}
