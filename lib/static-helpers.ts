import type { GetStaticPathsResult } from 'next';

export function isSSR(): boolean {
	return typeof window === 'undefined';
}

export const staticPathsNoData = ( data?: unknown ): GetStaticPathsResult | null => {
	if ( ! data ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return null;
};
