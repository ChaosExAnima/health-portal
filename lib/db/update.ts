import { TABLES_TYPE } from 'lib/constants';

import type { Knex } from 'knex';

import type {
	ContentDB,
	DBCommonFields,
	DBMaybeInsert,
	ProviderDB,
} from './types';

export async function upsert< Table extends DBCommonFields >(
	table: TABLES_TYPE,
	row: DBMaybeInsert< Table >,
	trx: Knex.Transaction
): Promise< Table > {
	let id: number;
	if ( ! row.id ) {
		[ id ] = await trx( table ).insert( row );
	} else {
		await trx( table ).update( row );
		id = row.id;
	}

	if ( ! id ) {
		throw new Error( 'Could not save entity' );
	}
	row.id = id;
	return row as Table;
}

export async function upsertContent(
	row: DBMaybeInsert< ContentDB >,
	trx: Knex.Transaction
) {
	return upsert( 'content', row, trx );
}

export async function upsertProvider(
	row: DBMaybeInsert< ProviderDB >,
	trx: Knex.Transaction
) {
	return upsert( 'provider', row, trx );
}
