import { NonNegativeInteger } from 'type-fest';
import { CONTENTS_TYPE } from 'lib/constants';
import { MaybeArray, StringMap } from 'global-types';
import { Entity, Slug } from 'lib/entities/types';

type Methods = 'GET' | 'POST';
type EntityTypes = CONTENTS_TYPE | 'provider';
type EntityEndpointTypes = `${ EntityTypes }s`;
type WithStatus< R = Response > = R & { status: NonNegativeInteger };
type WithStatusCallback< R = Response > = ( response: WithStatus< R > ) => void;

// Abstract interfaces
abstract interface Response {
	success: boolean;
}
abstract interface SuccessResponse extends Response {
	success: true;
}

abstract interface ErrorResponse extends Response {
	success: false;
	errors: Array< string | ErrorInformation >;
}

// Specific responses
interface EntitySuccessResponse extends SuccessResponse {
	slug: Slug;
}

type EntityUpdateResponse = ErrorResponse | EntitySuccessResponse; // For entity endpoints.

interface RecordsSuccessResponse< E extends Entity > extends SuccessResponse {
	records: E[];
}

type RecordsResponse< E extends Entity > =
	| ErrorResponse
	| RecordsSuccessResponse< E >;

interface RecordSuccessResponse< E extends Entity > extends SuccessResponse {
	records: E;
}
type RecordResponse< E extends Entity > =
	| ErrorResponse
	| RecordSuccessResponse< E >;

// Other types
type ErrorInformation = {
	code: string;
	text: string;
};

type ErrorHandlerArg = undefined | MaybeArray< string | ErrorInformation >;
type ErrorHandler = ( message: ErrorHandlerArg ) => void;
