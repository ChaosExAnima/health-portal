import { AnyObjectSchema, ValidationError } from 'yup';
import { toArray } from 'lodash';

import { isPlainObject } from 'lib/casting';

import type { SaveEntityFunction } from 'lib/db/types';
import type { Entity } from 'lib/entities/types';
import type {
	EntityUpdateResponse,
	ErrorInformation,
	ErrorResponse,
	Response,
	WithStatus,
	WithStatusCallback,
} from './types';
import type { MaybeArray } from 'global-types';
import type { NextApiResponse } from 'next';

export function respondWithStatus(
	res: NextApiResponse< Response >
): WithStatusCallback {
	return ( { status, ...response }: WithStatus< Response > ) => {
		res.status( status ).json( response );
	};
}

export function errorToResponse(
	err: unknown,
	status = 500
): WithStatus< ErrorResponse > {
	let errors: MaybeArray< string > | ErrorInformation = 'Unknown error';
	if ( typeof err === 'string' ) {
		errors = err;
	} else if ( err instanceof ValidationError ) {
		status = 400;
		errors = err.errors;
	} else if ( err instanceof Error ) {
		errors = {
			code: err.name,
			text: err.message,
		};
	}
	return {
		success: false,
		errors: toArray( errors ),
		status,
	};
}

export function isInvalidMethod(
	respond: WithStatusCallback,
	method?: string,
	allowedMethods = [ 'GET', 'POST' ]
): method is never {
	const allowed =
		!! method && allowedMethods.includes( method.toUpperCase() );
	if ( allowed ) {
		return false;
	}
	respond( errorToResponse( 'Invalid method', 400 ) );
	return true;
}

export async function saveEntity< Input extends Entity >(
	input: unknown,
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

export async function insertEntity< Input extends Entity >(
	input: unknown,
	schema: AnyObjectSchema,
	save: SaveEntityFunction< Input >
): Promise< WithStatus< EntityUpdateResponse > > {
	if ( isPlainObject( input ) && 'id' in input ) {
		return errorToResponse( 'Cannot insert entity with ID', 400 );
	}
	return saveEntity( input, schema.omit( [ 'id' ] ), save );
}
