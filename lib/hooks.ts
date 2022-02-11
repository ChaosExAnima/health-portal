import { useEffect, useState } from 'react';
import useSWR, { Key, SWRResponse } from 'swr';

import { RecordsResponse } from './api/types';

import type { Provider } from './entities/types';

async function fetcher< ResponseObject >(
	url: string
): Promise< ResponseObject > {
	const res = await fetch( url );
	return res.json();
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

export function useProvidersForSelect(): Map< string, string > {
	const response = useSWR< RecordsResponse< Provider > >(
		'/api/providers',
		fetcher
	);
	if ( response.error || ! response.data?.success ) {
		return new Map();
	}

	return new Map(
		response.data.records.map( ( { slug, name } ) => [ slug, name ] )
	);
}
