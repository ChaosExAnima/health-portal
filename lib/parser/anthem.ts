import dayjs from 'dayjs';
import { query } from 'lib/db';

import type { Claim, Provider } from 'lib/db/entities';
import { priceToNumber, slugify } from 'lib/strings';

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

export function isAnthemClaim( claim: Record< string, string > ): claim is RawClaim {
	return 'Claim Received' in claim;
}

export async function getProviderFromAnthemClaim( rawClaim: RawClaim ): Promise< Provider | undefined > {
	let provider: Provider | undefined;
	const em = await query();
	if ( rawClaim[ 'Provided By' ] ) {
		const providerSlug = slugify( rawClaim[ 'Provided By' ] );
		provider = await em.findOne< Provider >( 'Provider', { where: { slug: providerSlug } } );
		if ( ! provider ) {
			provider = em.create< Provider >( 'Provider', {
				name: rawClaim[ 'Provided By' ],
				slug: providerSlug,
			} );
			provider = await provider.save();
		}
	}
	return provider;
}

export async function parseAnthemClaim( rawClaim: RawClaim, providers: Provider[] ): Promise< Claim > {
	let status = 'PENDING';
	if ( rawClaim.Status ) {
		if ( rawClaim.Status === 'Approved' ) {
			status = 'APPROVED';
		} else if ( rawClaim.Status === 'Denied' ) {
			status = 'DENIED';
		}
	}

	const em = await query();
	const claim = em.create< Claim >( 'Claim', {
		number: rawClaim[ 'Claim Number' ],
		slug: slugify( rawClaim[ 'Claim Number' ] || 'unknown' ),
		type: rawClaim[ 'Claim Type' ] === 'Pharmacy' ? 'PHARMACY' : 'INNETWORK',
		serviceDate: dayjs( rawClaim[ 'Service Date' ] ).toDate(),
		status,
		billed: priceToNumber( rawClaim.Billed ) || 0,
		cost: priceToNumber( rawClaim[ 'Your Cost' ] ) || 0,
	} );

	// See: https://github.com/typeorm/typeorm/issues/2276
	const provider = providers.find( ( { slug } ) => slugify( rawClaim[ 'Provided By' ] ) === slug );
	claim.provider = provider && Promise.resolve( provider );
	return claim;
}
