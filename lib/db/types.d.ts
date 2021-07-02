import { CONTENT_ALL } from './constants';
import { Nullable } from 'global-types';

type CommonDB = {
	id: number;
	created: Date;
};
type MetaDB = {
	meta: Record< string, unknown >;
};

export type ContentDB = CommonDB & {
	identifier: string;
	type: typeof CONTENT_ALL;
	info: string;
	providerId: Nullable< number >;
	importId: Nullable< number >;
};

export type MetaDB = CommonDB & MetaDB & {
	contentId: number;
	key: string;
	value: Nullable< string >;
};

export type RelationDB = CommonDB & MetaDB & {
	from: number;
	to: number;
};

export type ProviderDB = CommonDB & {
	slug: string;
	name: string;
	phone: Nullable< string >;
	address: Nullable< string >;
	website: Nullable< string >;
	email: Nullable< string >;
	importId: Nullable< number >;
};
