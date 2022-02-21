import { ValidationError } from 'yup';

import { toArray } from 'lib/casting';
import { StatusError } from './errors';

import type { NextApiResponse } from 'next';
import type { MaybeArray } from 'global-types';
import type {
	ErrorInformation,
	ErrorResponse,
	Response,
	WithStatus,
	WithStatusCallback,
} from './types';

export function respondWithStatus< R extends Response >(
	res: NextApiResponse
): WithStatusCallback< R > {
	return ( { status, ...response } ) => {
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
	} else if ( err instanceof StatusError ) {
		status = err.status;
		errors = err.message;
	} else if ( err instanceof Error ) {
		errors = err.message;
	}
	return {
		success: false,
		errors: toArray( errors ),
		status,
	};
}

export function isInvalidMethod(
	respond: WithStatusCallback< any >,
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

export function checkMethod(
	method?: string,
	allowedMethods = [ 'GET', 'POST' ]
) {
	if ( ! method || ! allowedMethods.includes( method.toUpperCase() ) ) {
		throw new StatusError( 'Invalid method', 400 );
	}
}
