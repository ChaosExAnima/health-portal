import { DataTableRowLink } from './types';

export function isLinkObject( value: unknown ): value is DataTableRowLink {
	return (
		value &&
		typeof value === 'object' &&
		'slug' in value &&
		'__typename' in value &&
		'name' in value
	);
}
