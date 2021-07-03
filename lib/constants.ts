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

export const CLAIM_TYPE_IN = 'In Network';
export const CLAIM_TYPE_OUT = 'Out of Network';
export const CLAIM_TYPE_MEDS = 'Pharmacy';
export const CLAIM_TYPE_OTHER = 'Other';
export const CLAIM_TYPES = [
	CLAIM_TYPE_IN,
	CLAIM_TYPE_OUT,
	CLAIM_TYPE_MEDS,
	CLAIM_TYPE_OTHER,
];

export const CLAIM_STATUS_SUBMITTED = 'Submitted';
export const CLAIM_STATUS_PENDING = 'Pending';
export const CLAIM_STATUS_APPEALING = 'Appealing';
export const CLAIM_STATUS_APPROVED = 'Approved';
export const CLAIM_STATUS_DENIED = 'Denied';
export const CLAIM_STATUSES = [
	CLAIM_STATUS_SUBMITTED,
	CLAIM_STATUS_PENDING,
	CLAIM_STATUS_APPROVED,
	CLAIM_STATUS_APPEALING,
	CLAIM_STATUS_DENIED,
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
