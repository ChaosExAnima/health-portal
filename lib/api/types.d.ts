import { API_ENTITY_TYPE } from 'lib/constants';
import { MaybeArray } from 'global-types';
import { Entity, Slug } from 'lib/entities/types';

type Methods = 'GET' | 'POST';
type EntityTypes = API_ENTITY_TYPE;
type EntityEndpointTypes = `${ EntityTypes }s`;
type WithStatus< R extends Response > = R & { status: number };
type WithStatusCallback< R extends Response > = (
	response: WithStatus< R >
) => void;

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

// Queries
interface QueryPagination {
	offset: number;
	limit: number;
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
type RecordsResponseResult< E extends Entity > = Promise<
	WithStatus< RecordResponse< E > >
>;

interface RecordSuccessResponse< E extends Entity > extends SuccessResponse {
	record: E;
}
type RecordResponse< E extends Entity > =
	| ErrorResponse
	| RecordSuccessResponse< E >;
type RecordResponseResult< E extends Entity > = Promise<
	WithStatus< RecordResponse< E > >
>;

// Other types
type ErrorInformation = {
	code: string;
	text: string;
};

type ErrorHandlerArg = undefined | MaybeArray< string | ErrorInformation >;
type ErrorHandler = ( message: ErrorHandlerArg ) => void;
