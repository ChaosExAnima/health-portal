import type { NewTypes } from './types';

export function typeToUrl( type: NewTypes, slug?: string ): string {
	let path = '/';
	switch ( type ) {
		default:
			path = `/${ type }s`;
	}
	if ( slug ) {
		path += `/${ slug }`;
	}
	return path;
}
