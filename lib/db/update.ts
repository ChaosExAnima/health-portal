import { Knex } from 'knex';
import { TABLE_CONTENT } from 'lib/constants';

import type { ContentDB } from './types';

export async function upsertContent(
	row: ContentDB,
	trx: Knex.Transaction
): Promise< ContentDB > {
	let id: number;
	if ( row.id === 0 ) {
		[ id ] = await trx( TABLE_CONTENT ).insert( row );
	} else {
		await trx( TABLE_CONTENT ).update( row );
		id = row.id;
	}

	if ( ! id ) {
		throw new Error( 'Could not save entity' );
	}
	row.id = id;
	return row;
}
