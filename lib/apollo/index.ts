import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { addMocksToSchema } from '@graphql-tools/mock';

import mocks from './schema/mocks';
import { isSSR } from 'lib/static-helpers';

import type { IncomingMessage, ServerResponse } from 'http';
import type { GraphQLSchema } from 'graphql';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export type ResolverContext = {
	req?: IncomingMessage;
	res?: ServerResponse;
};

export function makeSchema(): GraphQLSchema {
	const loadedFiles = loadFilesSync( join( process.cwd(), 'lib/apollo/schema/*.graphqls' ) );
	const typeDefs = mergeTypeDefs( loadedFiles );
	const schema = makeExecutableSchema( {
		typeDefs,
	} );

	return addMocksToSchema( { schema, mocks } );
}

export async function createApolloClient( context?: ResolverContext ): Promise<ApolloClient<NormalizedCacheObject>> {
	let link;

	if ( isSSR() ) {
		const { SchemaLink } = await import( '@apollo/client/link/schema' );
		const schema = makeSchema();
		link = new SchemaLink( { context, schema } );
	} else {
		const { HttpLink } = await import( '@apollo/client/link/http' );
		link = new HttpLink( {
			uri: '/api/graphql',
			credentials: 'same-origin',
		} );
	}

	return new ApolloClient( {
		ssrMode: isSSR(),
		link,
		cache: new InMemoryCache(),
	} );
}

export async function initializeApollo(
	initialState: NormalizedCacheObject | null = null,
	context?: ResolverContext
): Promise<ApolloClient<NormalizedCacheObject>> {
	const _apolloClient = apolloClient ?? await createApolloClient( context );
	if ( initialState ) {
		_apolloClient.cache.restore( initialState );
	}

	if ( isSSR() ) {
		return _apolloClient;
	}
	if ( ! apolloClient ) {
		apolloClient = _apolloClient;
	}
	return _apolloClient;
}
