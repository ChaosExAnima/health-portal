import type { SetRequired } from 'type-fest';

import {
	CLAIM_STATUSES,
	CLAIM_STATUS_UNKNOWN,
	CLAIM_TYPES,
	CLAIM_TYPE_OTHER,
} from 'lib/constants';
import { ContentDB, MetaDB, ProviderDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

import { rowToProvider } from './provider';
import { Claim } from './types';
import { dateToString, getNumericMeta } from './utils';

type ClaimAdditions = {
	meta?: MetaDB[];
	providers?: ProviderDB[];
	provider?: ProviderDB;
	relations?: ContentDB[];
};
type ClaimWithMeta = { meta: MetaDB[] };
type ClaimWithProviders = { providers: ProviderDB[] };

type ClaimWithAdditions< T > = T extends ClaimWithMeta & ClaimWithProviders
	? SetRequired< Claim, 'cost' | 'billed' | 'provider' >
	: T extends ClaimWithMeta
	? SetRequired< Claim, 'cost' | 'billed' >
	: T extends ClaimWithProviders
	? SetRequired< Claim, 'provider' >
	: Claim;

export default function rowToClaim< T extends ClaimAdditions >(
	row: ContentDB,
	additions: T
): ClaimWithAdditions< T > {
	const { meta, providers } = additions;
	const { id, identifier: number, created: createdDate, info, status } = row;
	const created = dateToString( createdDate );
	const claim: Claim = {
		id,
		number,
		slug: slugify( number ),
		date: created,
		status: ( CLAIM_STATUSES.includes(
			status as typeof CLAIM_STATUSES[ number ]
		)
			? status
			: CLAIM_STATUS_UNKNOWN ) as typeof CLAIM_STATUSES[ number ],
		created,
		type: ( CLAIM_TYPES.includes( info as typeof CLAIM_TYPES[ number ] )
			? info
			: CLAIM_TYPE_OTHER ) as typeof CLAIM_TYPES[ number ],
	};

	if ( providers && row.providerId ) {
		const provider = providers.find(
			( { id: providerId } ) => providerId === row.providerId
		);
		if ( provider ) {
			claim.provider = rowToProvider( provider );
		}
	}

	const contentMeta = ( meta || [] ).filter(
		( { contentId } ) => contentId === id
	);
	if ( contentMeta.length ) {
		claim.billed = getNumericMeta( 'billed', contentMeta );
		claim.cost = getNumericMeta( 'cost', contentMeta );
	}

	return claim as ClaimWithAdditions< T >;
}
