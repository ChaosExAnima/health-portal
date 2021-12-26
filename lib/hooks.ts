import { useEffect, useState } from 'react';
import useSWR, { Key, SWRResponse } from 'swr';

async function fetcher< ResponseObject >(
	url: string
): Promise< ResponseObject > {
	const res = await fetch( url );
	const body = await res.json();
	return body;
}

/**
 * Passes through a value through a debounce.
 *
 * @param {any}    value Value to pass.
 * @param {number} delay Milliseconds to delay.
 * @see https://usehooks.com/useDebounce/
 * @return {any} The value, debounced. Like magic!
 */
export function useDebounce< T >( value: T, delay: number ): T {
	// State and setters for debounced value
	const [ debouncedValue, setDebouncedValue ] = useState< T >( value );
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout( () => {
				setDebouncedValue( value );
			}, delay );
			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout( handler );
			};
		},
		[ value, delay ] // Only re-call effect if value or delay changes
	);
	return debouncedValue;
}

export function useDebouncedSWR< Response >(
	key: Key
): SWRResponse< Response > {
	const debouncedKey = useDebounce( key, 500 );
	const response = useSWR< Response >( debouncedKey, fetcher );
	return response;
}