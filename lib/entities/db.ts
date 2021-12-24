import { Knex } from 'knex';
import { uniq, map, toSafeInteger } from 'lodash';

import { toArray } from 'lib/casting';
import * as constants from 'lib/constants';
import getDB from 'lib/db';

import type { Entity } from './types';
import type { Nullable, StringKeys } from 'global-types';
import type {
	ContentDB,
	DBCommonFields,
	LoadedRelationDB,
	MetaDB,
	ProviderDB,
} from 'lib/db/types';

export function getIdColumn< T extends DBCommonFields >(
	entities: T[],
	column: Extract< keyof T, string >
): number[] {
	return uniq( map( entities, column ) ).map( toSafeInteger );
}

export function getIds( entities: DBCommonFields[] ): number[] {
	return getIdColumn( entities, 'id' );
}

export function queryContentType(
	types: constants.CONTENTS_TYPE | constants.CONTENTS_TYPE[]
): Knex.QueryBuilder< ContentDB, ContentDB[] > {
	const knex = getDB();
	return knex( constants.TABLE_CONTENT ).whereIn( 'type', toArray( types ) );
}

type queryFunction = () => Knex.QueryBuilder< ContentDB, ContentDB[] >;

export const queryAppeals: queryFunction = () =>
	queryContentType( constants.CONTENT_APPEAL );
export const queryCalls: queryFunction = () =>
	queryContentType( constants.CONTENT_CALL );
export const queryClaims: queryFunction = () =>
	queryContentType( constants.CONTENT_CLAIM );
export const queryFiles: queryFunction = () =>
	queryContentType( constants.CONTENT_FILE );
export const queryPayments: queryFunction = () =>
	queryContentType( constants.CONTENT_PAYMENT );
export const queryNotes: queryFunction = () =>
	queryContentType( constants.CONTENT_NOTE );

export function queryRelated(
	contentIds: number | number[]
): Knex.QueryBuilder< LoadedRelationDB, LoadedRelationDB[] > {
	const knex = getDB();
	return knex( constants.TABLE_RELATIONS )
		.whereIn( 'from', toArray( contentIds ) )
		.join( constants.TABLE_CONTENT, 'to', 'id' );
}

export function queryRelatedOfType(
	contentIds: number | number[],
	types: constants.CONTENTS_TYPE | constants.CONTENTS_TYPE[]
): Knex.QueryBuilder< LoadedRelationDB, LoadedRelationDB[] > {
	return queryRelated( contentIds ).whereIn( 'type', toArray( types ) );
}

export function queryMeta(
	contentIds: number | number[]
): Knex.QueryBuilder< MetaDB, MetaDB[] > {
	const knex = getDB();
	return knex( constants.TABLE_META ).whereIn(
		'contentId',
		toArray( contentIds )
	);
}

export function queryAllMeta< T extends Entity >(
	key: StringKeys< T >
): Knex.QueryBuilder< MetaDB, MetaDB[] > {
	const knex = getDB();
	return knex( constants.TABLE_META ).where( 'key', key );
}

export function queryProvider(
	providerId: Nullable< number >
): Knex.QueryBuilder< ProviderDB, ProviderDB | undefined > {
	const knex = getDB();
	return knex( constants.TABLE_PROVIDERS ).where( 'id', providerId ).first();
}

export function queryAllProviders(): Knex.QueryBuilder<
	ProviderDB,
	ProviderDB[]
> {
	const knex = getDB();
	return knex( constants.TABLE_PROVIDERS );
}

export function queryRelatedProviders(
	contentIds: number | number[]
): Knex.QueryBuilder< ProviderDB, ProviderDB[] > {
	const knex = getDB();
	return knex( constants.TABLE_PROVIDERS ).whereIn(
		'id',
		toArray( contentIds )
	);
}
