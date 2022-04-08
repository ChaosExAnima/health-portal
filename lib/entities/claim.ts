import { ensureProvider, rowToProvider } from './provider';
import {
	dateToString,
	getNumericMeta,
	inReadonlyArray,
	isEntity,
	relatedOfType,
	saveContentEntity,
} from './utils';
import * as constants from 'lib/constants';
import { slugify } from 'lib/strings';
import { isObjectWithKeys } from 'lib/casting';
import { rowToNote } from './note';

import type { Knex } from 'knex';
import type { ContentDB, DBMaybeInsert } from 'lib/db/types';
import type {
	Claim,
	ClaimInput,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	WithMetaAdditions,
} from './types';

type ClaimWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Claim,
	A
> & {
	billed: A extends WithMetaAdditions< A > ? number : never;
	cost: A extends WithMetaAdditions< A > ? number : never;
};

export function isClaim( input: unknown ): input is Claim {
	return (
		isEntity( input ) &&
		isObjectWithKeys( input, [ 'number', 'type', 'status' ] ) &&
		!! inReadonlyArray(
			String( input.status ),
			constants.CLAIM_STATUSES
		) &&
		!! inReadonlyArray( String( input.type ), constants.CLAIM_TYPES )
	);
}

export function rowToClaim< T extends EntityAdditions >(
	row: ContentDB,
	additions: T = {} as T
): ClaimWithAdditions< T > {
	const { meta, provider, providers, relations } = additions;
	const { id, identifier: number, created, info, status } = row;
	const claim: Claim = {
		id: id as Id,
		number,
		slug: slugify( number ),
		created: dateToString( created ),
		status: inReadonlyArray(
			status,
			constants.CLAIM_STATUSES,
			constants.CLAIM_STATUS_UNKNOWN
		),
		type: inReadonlyArray(
			String( info ),
			constants.CLAIM_TYPES,
			constants.CLAIM_TYPE_OTHER
		),
	};

	if ( provider ) {
		claim.provider = rowToProvider( provider );
	} else if ( providers ) {
		const providerRow = providers.find(
			( { id: providerId } ) => providerId === row.providerId
		);
		claim.provider = providerRow ? rowToProvider( providerRow ) : undefined;
	}

	const contentMeta = ( meta || [] ).filter(
		( { contentId } ) => contentId === id
	);
	if ( contentMeta.length ) {
		claim.billed = getNumericMeta( 'billed', contentMeta );
		claim.cost = getNumericMeta( 'cost', contentMeta );
	}

	if ( relations ) {
		const noteRows = relatedOfType( relations, 'note' );
		claim.notes = noteRows.map( rowToNote );
	}

	return claim as ClaimWithAdditions< T >;
}

export async function claimToRow(
	input: Claim | ClaimInput,
	trx: Knex.Transaction
): Promise< DBMaybeInsert< ContentDB > > {
	let providerId = null;
	if ( input.provider ) {
		providerId = ( await ensureProvider( input.provider, trx ) ).id;
	}
	return {
		id: input.id,
		created: new Date( input.created ),
		type: constants.CONTENT_CLAIM,
		identifier: input.number,
		status: input.status,
		info: String( input.type ),
		providerId,
	};
}

export function saveClaim( input: ClaimInput ) {
	return saveContentEntity( input, claimToRow );
}
