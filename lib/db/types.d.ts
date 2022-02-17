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

type DBCommonFields = {
	id: number;
	created: Date;
};
type DBMetaField = {
	meta: Record< string, unknown >;
};

type ContentDB = DBCommonFields & {
	identifier: string;
	type: CONTENTS_TYPE;
	info: string;
	status: string;
	providerId: Nullable< ProviderDB[ 'id' ] >;
	importId: Nullable< ImportDB[ 'id' ] >;
};

type MetaDB = DBCommonFields &
	DBMetaField & {
		contentId: ContentDB[ 'id' ];
		key: string;
		value: Nullable< string >;
	};

type RelationDB = DBCommonFields &
	DBMetaField & {
		from: ContentDB[ 'id' ];
		to: ContentDB[ 'id' ];
	};
type LoadedRelationDB = RelationDB & ContentDB;

type ProviderDB = DBCommonFields & {
	slug: string;
	name: string;
	phone: Nullable< string >;
	address: Nullable< string >;
	website: Nullable< string >;
	email: Nullable< string >;
	importId: Nullable< ImportDB[ 'id' ] >;
};

type ImportDB = DBCommonFields & {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	fileId: Nullable< ContentDB[ 'id' ] >;
};

type SaveEntityFunction< InputEntity extends Entity > = (
	input: Entity
) => Promise< Slug >;

declare module 'knex/types/tables' {
	interface Tables {
		[ TABLE_CONTENT ]: ContentDB;
		[ TABLE_META ]: MetaDB;
		[ TABLE_RELATIONS ]: RelationDB;
		[ TABLE_PROVIDERS ]: ProviderDB;
		[ TABLE_IMPORTS ]: ImportDB;
	}
}
