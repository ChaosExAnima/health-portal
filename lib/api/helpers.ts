import { ValidationError } from 'yup';
import { toArray } from 'lodash';

import type {
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
