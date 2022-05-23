import {
	CONTENTS_TYPE,
	TABLE_CONTENT,
	TABLE_IMPORTS,
	TABLE_META,
	TABLE_PROVIDERS,
	TABLE_RELATIONS,
} from 'lib/constants';

interface DBCommonFields {
	id: number;
	created: Date;
}
interface DBMetaField< MetaFields extends Record< string, any > > {
	meta: Partial< MetaFields >;
}

interface ContentDB extends DBCommonFields {
	identifier: string;
	type: CONTENTS_TYPE;
	info?: string;
	status: string;
	providerId?: ProviderDB[ 'id' ];
}

interface MetaDB< MetaFields = Record< string, any > >
	extends DBCommonFields,
		DBMetaField< MetaFields > {
	contentId: ContentDB[ 'id' ];
	key: string;
	value?: string;
}

interface RelationDB extends DBCommonFields, DBMetaField {
	from: ContentDB[ 'id' ];
	to: ContentDB[ 'id' ];
}

interface ProviderDB extends DBCommonFields {
	slug: string;
	name: string;
	phone?: string;
	address?: string;
	website?: string;
	email?: string;
	importId?: ImportDB[ 'id' ];
}

interface ImportDB extends DBCommonFields {
	hash: string;
	inserted?: number;
	updated?: number;
	fileId?: ContentDB[ 'id' ];
}

declare module 'knex/types/tables' {
	// eslint-disable-next-line no-unused-vars
	interface Tables {
		[ TABLE_CONTENT ]: ContentDB;
		[ TABLE_META ]: MetaDB;
		[ TABLE_RELATIONS ]: RelationDB;
		[ TABLE_PROVIDERS ]: ProviderDB;
		[ TABLE_IMPORTS ]: ImportDB;
	}
}
