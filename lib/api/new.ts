import { isString } from 'lodash';

import type { NextRouter } from 'next/router';
import type { Nullable } from 'global-types';
import type {
	ErrorHandler,
	ErrorHandlerArg,
	NewResponse,
	NewTypes,
} from './types';

export async function handleNewType< Input >(
	form: Input,
	type: NewTypes,
	handleError: ErrorHandler,
	{ push }: NextRouter
): Promise< void > {
	const response = await fetch( `/api/new/${ type }`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( form ),
	} );
	const body = ( await response.json() ) as Nullable< NewResponse >;
	if ( ! body ) {
		// Error parsing response from server.
		handleError( 'Could not parse response from server' );
	} else if ( ! body.success ) {
		handleError( body.errors );
	} else {
		const slug = body.slug;
		push( `/${ type }/${ slug }` );
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
