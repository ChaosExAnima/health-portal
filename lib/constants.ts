export const TABLE_CONTENT = 'content';
export const TABLE_META = 'content_meta';
export const TABLE_RELATIONS = 'content_relations';
export const TABLE_PROVIDERS = 'provider';
export const TABLE_IMPORTS = 'import';
export const TABLES = [
	TABLE_CONTENT,
	TABLE_META,
	TABLE_RELATIONS,
	TABLE_PROVIDERS,
	TABLE_IMPORTS,
] as const;
export type TABLES_TYPE = typeof TABLES[ number ];

export const CONTENT_APPEAL = 'appeal';
export const CONTENT_CALL = 'call';
export const CONTENT_CLAIM = 'claim';
export const CONTENT_FILE = 'file';
export const CONTENT_NOTE = 'note';
export const CONTENT_PAYMENT = 'payment';
export const CONTENTS = [
	CONTENT_APPEAL,
	CONTENT_CALL,
	CONTENT_CLAIM,
	CONTENT_FILE,
	CONTENT_NOTE,
	CONTENT_PAYMENT,
] as const;
export type CONTENTS_TYPE = typeof CONTENTS[ number ];

export const CLAIM_TYPE_IN = 'in network';
export const CLAIM_TYPE_OUT = 'out of network';
export const CLAIM_TYPE_MEDS = 'pharmacy';
export const CLAIM_TYPE_DENTAL = 'dental';
export const CLAIM_TYPE_OTHER = 'other';
export const CLAIM_TYPES = [
	CLAIM_TYPE_IN,
	CLAIM_TYPE_OUT,
	CLAIM_TYPE_MEDS,
	CLAIM_TYPE_DENTAL,
	CLAIM_TYPE_OTHER,
] as const;
export type CLAIM_TYPES_TYPE = typeof CLAIM_TYPES[ number ];

export const CLAIM_STATUS_SUBMITTED = 'submitted';
export const CLAIM_STATUS_PENDING = 'pending';
export const CLAIM_STATUS_APPEALING = 'appealing';
export const CLAIM_STATUS_APPROVED = 'approved';
export const CLAIM_STATUS_DENIED = 'denied';
export const CLAIM_STATUS_DELETED = 'deleted';
export const CLAIM_STATUS_UNKNOWN = 'unknown';
export const CLAIM_STATUSES = [
	CLAIM_STATUS_SUBMITTED,
	CLAIM_STATUS_PENDING,
	CLAIM_STATUS_APPROVED,
	CLAIM_STATUS_APPEALING,
	CLAIM_STATUS_DENIED,
	CLAIM_STATUS_DELETED,
	CLAIM_STATUS_UNKNOWN,
] as const;
export type CLAIM_STATUS_TYPE = typeof CLAIM_STATUSES[ number ];
