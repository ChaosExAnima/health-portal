import { isPlainObject, isString } from 'lodash';
import Router from 'next/router';

import { typeToUrl } from './utils';
import { errorToResponse } from './helpers';

import type { AnyObjectSchema } from 'yup';
import type { Nullable, PlainObject } from 'global-types';
import type { InputEntity, SaveEntityFunction, Slug } from 'lib/entities/types';
import type {
	ErrorHandler,
	ErrorHandlerArg,
	EntityUpdateResponse,
	EntityTypes,
	WithStatus,
	QueryPagination,
} from './types';

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

export async function saveEntity< Input extends InputEntity >(
	input: Input,
	schema: AnyObjectSchema,
	save: SaveEntityFunction< Input >
): Promise< WithStatus< EntityUpdateResponse > > {
	try {
		const entity = ( await schema.validate( input ) ) as Input;
		const slug = await save( entity );
		return {
			success: true,
			status: 200,
			slug,
		};
	} catch ( err ) {
		return errorToResponse( err );
	}
}

export async function insertEntity< Input extends InputEntity >(
	input: Input,
	schema: AnyObjectSchema,
	save: SaveEntityFunction< Input >
): Promise< WithStatus< EntityUpdateResponse > > {
	if ( isPlainObject( input ) && 'id' in input ) {
		return errorToResponse( 'Cannot insert entity with ID', 400 );
	}
	return saveEntity( input, schema.omit( [ 'id' ] ), save );
}

export async function queryEntities(
	query: PlainObject
): Promise< QueryPagination > {
	const { object, number } = await import( 'yup' );
	return await object( {
		offset: number().min( 0 ).default( 0 ),
		limit: number()
			.min( 1, 'Limit needs to be more than zero' )
			.max( 100, 'Limit cannot exceed 100' )
			.default( 100 ),
	} ).validate( query );
}
