import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';

import type { dataSources } from './datasources';
import type { IncomingMessage, ServerResponse } from 'http';

let apolloClient: ApolloClient< NormalizedCacheObject > | undefined;

export type ResolverContext = {
	req?: IncomingMessage;
	res?: ServerResponse;
	dataSources: dataSources;
};

export function createApolloClient(
	context?: ResolverContext
): ApolloClient< NormalizedCacheObject > {
	let link;

	if ( typeof window === 'undefined' ) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { SchemaLink } = require( '@apollo/client/link/schema' );
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { makeSchema } = require( './schema' );
		const schema = makeSchema();
		link = new SchemaLink( { context, schema } );
	} else {
		link = createUploadLink( {
			uri: '/api/graphql',
			credentials: 'same-origin',
		} );
	}

	const cache = new InMemoryCache( {
		typePolicies: {
			Query: {
				fields: {
					history: offsetLimitPagination( [ 'type', 'id' ] ),
				},
			},
		},
	} );

	return new ApolloClient( {
		ssrMode: typeof window === 'undefined',
		link,
		cache,
	} );
}

export function initializeApollo(
	initialState: NormalizedCacheObject | null = null,
	context?: ResolverContext
): ApolloClient< NormalizedCacheObject > {
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
