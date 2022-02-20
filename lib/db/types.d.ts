import { knex } from 'knex';
import { Nullable } from 'global-types';
import {
	CONTENTS_TYPE,
	TABLE_CONTENT,
	TABLE_IMPORTS,
	TABLE_META,
	TABLE_PROVIDERS,
	TABLE_RELATIONS,
} from 'lib/constants';
import { Entity, Slug } from 'lib/entities/types';

interface DBCommonFields {
	id: number;
	created: Date;
}
type DBInsert< Insert extends DBCommonFields > = Omit< Insert, 'id' >;
type DBMaybeInsert< Insert extends DBCommonFields > = Omit< Insert, 'id' > & {
	id?: number;
};
interface DBMetaField {
	meta: Record< string, any >;
}

interface ContentDB extends DBCommonFields {
	identifier: string;
	type: CONTENTS_TYPE;
	info: Nullable< string >;
	status: string;
	providerId: Nullable< ProviderDB[ 'id' ] >;
	importId: Nullable< ImportDB[ 'id' ] >;
}

interface MetaDB extends DBCommonFields, DBMetaField {
	contentId: ContentDB[ 'id' ];
	key: string;
	value: Nullable< string >;
}

interface RelationDB extends DBCommonFields, DBMetaField {
	from: ContentDB[ 'id' ];
	to: ContentDB[ 'id' ];
}
interface LoadedRelationDB extends RelationDB, ContentDB {}

interface ProviderDB extends DBCommonFields {
	slug: string;
	name: string;
	phone: Nullable< string >;
	address: Nullable< string >;
	website: Nullable< string >;
	email: Nullable< string >;
	importId: Nullable< ImportDB[ 'id' ] >;
}

interface ImportDB extends DBCommonFields {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	fileId: Nullable< ContentDB[ 'id' ] >;
}

declare module 'knex/types/tables' {
	interface Tables {
		[ TABLE_CONTENT ]: ContentDB;
		[ TABLE_META ]: MetaDB;
		[ TABLE_RELATIONS ]: RelationDB;
		[ TABLE_PROVIDERS ]: ProviderDB;
		[ TABLE_IMPORTS ]: ImportDB;
	}
}
