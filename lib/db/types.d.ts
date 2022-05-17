import { Nullable } from 'global-types';
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
interface DBMetaField {
	meta: Record< string, any >;
}

interface ContentDB extends DBCommonFields {
	identifier: string;
	type: CONTENTS_TYPE;
	info: Nullable< string >;
	status: string;
	providerId?: Nullable< ProviderDB[ 'id' ] >;
}

interface MetaDB extends DBCommonFields, DBMetaField {
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
	interface Tables {
		[ TABLE_CONTENT ]: ContentDB;
		[ TABLE_META ]: MetaDB;
		[ TABLE_RELATIONS ]: RelationDB;
		[ TABLE_PROVIDERS ]: ProviderDB;
		[ TABLE_IMPORTS ]: ImportDB;
	}
}
