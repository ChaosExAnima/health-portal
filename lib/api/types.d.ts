import { CONTENTS_TYPE } from 'lib/constants';
import { MaybeArray } from 'global-types';

type NewTypes = CONTENTS_TYPE | 'provider'

type ErrorInformation = {
	code: string;
	text: string;
};
type ErrorResponse = {
	success: false;
	errors: Array< string | ErrorInformation >;
};
type SuccessResponse = {
	success: true;
	slug: string;
};

type NewResponse = ErrorResponse | SuccessResponse;

type ErrorHandlerArg = undefined | MaybeArray< string | ErrorInformation >;
type ErrorHandler = ( message: ErrorHandlerArg ) => void;
