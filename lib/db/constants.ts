export const TABLE_CONTENT = 'content';
export const TABLE_META = 'content_meta';
export const TABLE_RELATIONS = 'content_relations';
export const TABLE_PROVIDERS = 'provider';
export const TABLE_IMPORTS = 'import';

export const CONTENT_APPEAL = 'appeal';
export const CONTENT_CALL = 'call';
export const CONTENT_CLAIM = 'claim';
export const CONTENT_FILE = 'file';
export const CONTENT_NOTE = 'note';
export const CONTENT_PAYMENT = 'payment';
export const CONTENT_ALL = [
	CONTENT_APPEAL,
	CONTENT_CALL,
	CONTENT_CLAIM,
	CONTENT_FILE,
	CONTENT_NOTE,
	CONTENT_PAYMENT,
] as const;

export default {
	TABLE_CONTENT,
	TABLE_META,
	TABLE_RELATIONS,
	TABLE_IMPORTS,
	TABLE_PROVIDERS,
	CONTENT_ALL,
	...CONTENT_ALL,
};
