import { knex } from 'knex';
import { Nullable } from 'global-types';
import { CONTENT_ALL, TABLE_CONTENT, TABLE_IMPORTS, TABLE_META, TABLE_PROVIDERS, TABLE_RELATIONS } from 'lib/constants';

export type DBCommonFields = {
	id: number;
	created: Date;
};
export type DBMetaField = {
	meta: Record< string, unknown >;
};

export type ContentDB = DBCommonFields & {
	identifier: string;
	type: typeof CONTENT_ALL;
	info: string;
	providerId: Nullable< ProviderDB["id"] >;
};

export type MetaDB = DBCommonFields & DBMetaField & {
	contentId: ContentDB["id"];
	key: string;
	value: Nullable< string >;
};

export type RelationDB = DBCommonFields & DBMetaField & {
	from: ContentDB["id"];
	to: ContentDB["id"];
};

export type ProviderDB = DBCommonFields & {
	slug: string;
	name: string;
	phone: Nullable< string >;
	address: Nullable< string >;
	website: Nullable< string >;
	email: Nullable< string >;
	importId: Nullable< ImportDB["id"] >;
};

export type ImportDB = DBCommonFields & {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	fileId: Nullable< ContentDB["id"] >;
};

declare module 'knex/types/tables' {
	interface Tables {
		[ TABLE_CONTENT ]: ContentDB;
		[ TABLE_META ]: MetaDB;
		[ TABLE_RELATIONS ]: RelationDB;
		[ TABLE_PROVIDERS ]: ProviderDB;
		[ TABLE_IMPORTS ]: ImportDB;
	}
}
