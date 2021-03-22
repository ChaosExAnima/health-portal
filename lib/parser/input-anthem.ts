import InputBase, { ClaimInsertData, RawClaim } from './input-base';
import { priceToNumber } from 'lib/strings';

export type AnthemClaim = {
	'Claim Type': string;
	'Claim Number': string;
	'Service Date': string;
	Status: string;
	'Provided By': string;
	Billed: string;
	'Your Cost': string;
};
export type AnthemClaimFull = AnthemClaim & {
	'Allowed Amount'?: string;
	Coinsurance?: string;
	Copay?: string;
	'Claim Received'?: string;
	Deductible?: string;
	'Not covered'?: string;
	Paid?: string;
	Patient?: string;
	'Processed Date'?: string;
};

export default class InputAnthem extends InputBase< AnthemClaim > {
	public validate( input: RawClaim ): input is AnthemClaim {
		return 'Provided By' in input;
	}

	public convert( input: AnthemClaim ): ClaimInsertData {
		let status = 'PENDING';
		if ( input.Status === 'Approved' ) {
			status = 'APPROVED';
		} else if ( input.Status === 'Denied' ) {
			status = 'DENIED';
		}

		return {
			number: input[ 'Claim Number' ],
			type:
				input[ 'Claim Type' ] === 'Pharmacy' ? 'PHARMACY' : 'INNETWORK',
			serviceDate: new Date( input[ 'Service Date' ] ),
			status,
			billed: priceToNumber( input.Billed ) || 0,
			cost: priceToNumber( input[ 'Your Cost' ] ) || 0,
		};
	}
}
