import { isString } from 'lodash';
import Router from 'next/router';

import { typeToUrl } from './utils';

import type { Nullable } from 'global-types';
import type {
	ErrorHandler,
	ErrorHandlerArg,
	EntityUpdateResponse,
	EntityTypes,
} from './types';

import type { Slug } from 'lib/entities/types';

export async function handleUpdateType(
	form: unknown,
	type: EntityTypes,
	handleError: ErrorHandler,
	slug?: Slug
): Promise< void > {
	const response = await fetch( '/api' + typeToUrl( type, slug ), {
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
