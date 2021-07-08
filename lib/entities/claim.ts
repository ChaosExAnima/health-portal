import type { SetRequired } from 'type-fest';

import { rowToProvider } from './provider';
import { Claim } from './types';
import { dateToString, getNumericMeta, inReadonlyArray } from './utils';
import * as constants from 'lib/constants';
import { ContentDB, MetaDB, ProviderDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

type ClaimAdditions = {
	meta?: MetaDB[];
	providers?: ProviderDB[];
	provider?: ProviderDB;
	relations?: ContentDB[];
};
type ClaimWithMeta = { meta: MetaDB[] };
type ClaimWithProviders = { providers: ProviderDB[] };

type ClaimWithAdditions< T > = T extends ClaimWithMeta & ClaimWithProviders
	? SetRequired< Claim, metaFieldType | 'provider' >
	: T extends ClaimWithMeta
	? SetRequired< Claim, metaFieldType >
	: T extends ClaimWithProviders
	? SetRequired< Claim, 'provider' >
	: Claim;

export const metaFields = [ 'cost', 'billed' ] as const;
export type metaFieldType = typeof metaFields[ number ];

export const related = [
	constants.CONTENT_APPEAL,
	constants.CONTENT_CALL,
	constants.CONTENT_NOTE,
	constants.CONTENT_PAYMENT,
] as const;
export type relatedType = typeof related[ number ];

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
		status: inReadonlyArray(
			status,
			constants.CLAIM_STATUSES,
			constants.CLAIM_STATUS_UNKNOWN
		),
		created,
		type: inReadonlyArray(
			info,
			constants.CLAIM_TYPES,
			constants.CLAIM_TYPE_OTHER
		),
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
