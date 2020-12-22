import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';

export const getClient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient( {
	uri: 'http://localhost:3000/api/graphql',
	cache: new InMemoryCache(),
} );
