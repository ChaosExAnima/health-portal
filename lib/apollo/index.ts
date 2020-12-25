import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
	HttpLink,
} from '@apollo/client';

import type { IncomingMessage, ServerResponse } from 'http';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export type ResolverContext = {
	req?: IncomingMessage;
	res?: ServerResponse;
};

export function createApolloClient( context?: ResolverContext ): ApolloClient<NormalizedCacheObject> {
	let link;

	if ( typeof window === 'undefined' ) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { SchemaLink } = require( '@apollo/client/link/schema' );
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { makeSchema } = require( './schema' );
		const schema = makeSchema();
		link = new SchemaLink( { context, schema } );
	} else {
		link = new HttpLink( {
			uri: '/api/graphql',
			credentials: 'same-origin',
		} );
	}

	return new ApolloClient( {
		ssrMode: typeof window === 'undefined',
		link,
		cache: new InMemoryCache(),
	} );
}

export function initializeApollo(
	initialState: NormalizedCacheObject | null = null,
	context?: ResolverContext
): ApolloClient<NormalizedCacheObject> {
	const _apolloClient = apolloClient ?? createApolloClient( context );
	if ( initialState ) {
		_apolloClient.cache.restore( initialState );
	}

	if ( typeof window === 'undefined' ) {
		return _apolloClient;
	}
	if ( ! apolloClient ) {
		apolloClient = _apolloClient;
	}
	return _apolloClient;
}
