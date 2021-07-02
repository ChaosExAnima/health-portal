import { CONTENT_ALL } from './constants';
import { Nullable } from 'global-types';

type DBCommonFields = {
	id: number;
	created: Date;
};
type DBMetaField = {
	meta: Record< string, unknown >;
};

export type ContentDB = DBCommonFields & {
	identifier: string;
	type: typeof CONTENT_ALL;
	info: string;
	providerId: Nullable< number >;
	importId: Nullable< number >;
};

export type MetaDB = DBCommonFields & DBMetaField & {
	contentId: number;
	key: string;
	value: Nullable< string >;
};

export type RelationDB = DBCommonFields & DBMetaField & {
	from: number;
	to: number;
};

export type ProviderDB = DBCommonFields & {
	slug: string;
	name: string;
	phone: Nullable< string >;
	address: Nullable< string >;
	website: Nullable< string >;
	email: Nullable< string >;
	importId: Nullable< number >;
};

export type ImportDB = DBCommonFields & {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	fileId: Nullable< number >;
};
