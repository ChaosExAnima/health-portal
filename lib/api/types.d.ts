import { CONTENTS_TYPE } from 'lib/constants';
import { MaybeArray, StringMap } from 'global-types';
import { Entity } from 'lib/entities/types';

type NewTypes = CONTENTS_TYPE | 'provider';

// Abstract interfaces
abstract interface SuccessResponse {
	success: true;
}

abstract interface ErrorResponse {
	success: false;
	errors: Array< string | ErrorInformation >;
}

// Specific responses
interface NewSuccessResponse extends SuccessResponse {
	slug: string;
}

type NewResponse = ErrorResponse | NewSuccessResponse; // For /new endpoints.

interface RecordsSuccessResponse< E extends Entity > extends SuccessResponse {
	records: E[];
}

type RecordsResponse< E extends Entity > = ErrorResponse | RecordsSuccessResponse< E >;

// Other types
type ErrorInformation = {
	code: string;
	text: string;
};

type ErrorHandlerArg = undefined | MaybeArray< string | ErrorInformation >;
type ErrorHandler = ( message: ErrorHandlerArg ) => void;

