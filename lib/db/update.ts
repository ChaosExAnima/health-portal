import { Knex } from 'knex';
import { TABLE_CONTENT } from 'lib/constants';

import type { ContentDB, DBMaybeInsert } from './types';

export async function upsertContent(
	row: DBMaybeInsert< ContentDB >,
	trx: Knex.Transaction
): Promise< ContentDB > {
	let id: number;
	if ( ! row.id ) {
		[ id ] = await trx( TABLE_CONTENT ).insert( row );
	} else {
		await trx( TABLE_CONTENT ).update( row );
		id = row.id;
	}

	if ( ! id ) {
		throw new Error( 'Could not save entity' );
	}
	row.id = id;
	return row as ContentDB;
}
