import { SWRResponse } from 'swr';

let response: unknown;
export const setResponse = < Data >( newResponse: Data ) => {
	response = newResponse;
};
export const clearResponse = () => {
	response = undefined;
};

export const mock = jest.fn(
	() =>
		( {
			data: response,
			mutate: ( data: unknown ) => Promise.resolve( data ),
			isValidating: false,
		} as SWRResponse< typeof response, Error > )
);

export default function useSWR() {
	return mock();
}
