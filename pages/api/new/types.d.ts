type ErrorResponse = {
	success: false;
	errors: Record< string, string[] >;
};
type SuccessResponse = {
	success: true;
	url: string;
};

type NewResponse = ErrorResponse | SuccessResponse;
