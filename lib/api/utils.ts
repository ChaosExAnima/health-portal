import type { EntityEndpointTypes, EntityTypes } from './types';

export function pluralizeType( type: EntityTypes ): EntityEndpointTypes {
	return `${ type }s`;
}

export function typeToUrl( type: EntityTypes, slug?: string ): string {
	let path = `/${ pluralizeType( type ) }`;
	if ( slug ) {
		path += `/${ slug }`;
	}
	return path;
}
