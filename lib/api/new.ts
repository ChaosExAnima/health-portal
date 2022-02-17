import { isString } from 'lodash';
import Router from 'next/router';

import type { Nullable } from 'global-types';
import type {
	ErrorHandler,
	ErrorHandlerArg,
	EntityUpdateResponse,
	NewTypes,
} from './types';
import { typeToUrl } from './utils';

import type { Entity, Slug } from 'lib/entities/types';

export async function handleUpdateType< Input extends Entity >(
	form: unknown,
	type: NewTypes,
	handleError: ErrorHandler,
	slug?: Slug
): Promise< void > {
	const response = await fetch( `/api/${ type }/${ slug }`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( form ),
	} );
	const body = ( await response.json() ) as Nullable< EntityUpdateResponse >;
	if ( ! body ) {
		// Error parsing response from server.
		handleError( 'Could not parse response from server' );
	} else if ( ! body.success ) {
		handleError( body.errors );
	} else {
		const slug = body.slug;
		Router.push( typeToUrl( type, slug ) );
	}
}

export function formatErrors( errors: ErrorHandlerArg ): string[] {
	if ( ! Array.isArray( errors ) ) {
		if ( ! errors ) {
			return [];
		}
		if ( isString( errors ) ) {
			return [ errors ];
		}
		return [ errors.text ];
	}
	return errors.map( formatErrors ).flat();
}
