import { isObjectWithKeys } from 'lib/casting';
import * as constants from 'lib/constants';
import { slugify } from 'lib/strings';
import { rowToClaim } from './claim';
import { ensureProvider } from './provider';
import rowToNote from './note';
import { inReadonlyArray, isEntity, saveContentEntity } from './utils';

import type { Knex } from 'knex';
import type { ContentDB } from 'lib/db/types';
import type {
	Appeal,
	AppealInput,
	Claim,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	WithRelationAdditions,
} from './types';

type AppealWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Appeal,
	A
> & {
	claims: A extends WithRelationAdditions< A > ? Claim[] : never;
};

export const related = [
	constants.CONTENT_CLAIM,
	constants.CONTENT_NOTE,
] as const;
export type relatedType = typeof related[ number ];

export function isAppeal( input: unknown ): input is Appeal {
	return (
		isEntity( input ) &&
		isObjectWithKeys( input, [ 'name', 'status' ] ) &&
		!! inReadonlyArray( String( input.status ), constants.APPEAL_STATUSES )
	);
}

export async function appealToRow(
	input: Appeal | AppealInput,
	trx: Knex.Transaction
): Promise< ContentDB > {
	const row = {
		id: input.id ?? 0,
		type: constants.CONTENT_APPEAL,
		status: input.status,
		info: null,
		importId: null,
	} as const;
	let providerId = null;
	if ( input.provider ) {
		providerId = ( await ensureProvider( input.provider, trx ) ).id;
	}
	if ( isAppeal( input ) ) {
		return {
			...row,
			created: input.created,
			identifier: input.slug,
			providerId,
		};
	}
	return {
		...row,
		created: new Date(),
		identifier: slugify( input.name ),
		providerId,
	};
}

export function rowToAppeal< A extends EntityAdditions >(
	row: ContentDB,
	additions: A = {} as A
): AppealWithAdditions< A > {
	const { relations } = additions;
	const { id, identifier: name, created, status } = row;
	const appeal: Appeal = {
		id: id as Id,
		slug: slugify( name ),
		name,
		status: inReadonlyArray(
			status,
			constants.APPEAL_STATUSES,
			constants.APPEAL_STATUS_PENDING
		),
		created,
	};
	if ( relations ) {
		appeal.claims = [];
		appeal.notes = [];
		for ( const relation of relations ) {
			if ( relation.type === constants.CONTENT_CLAIM ) {
				appeal.claims.push( rowToClaim( relation, {} ) );
			} else if ( relation.type === constants.CONTENT_NOTE ) {
				appeal.notes.push( rowToNote( relation ) );
			}
		}
	}

	return appeal as AppealWithAdditions< A >;
}

export function saveAppeal( input: AppealInput ) {
	return saveContentEntity( input, appealToRow );
}
