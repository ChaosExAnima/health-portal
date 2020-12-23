import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';

export const getClient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient( {
	uri: 'http://localhost:3000/api/graphql',
	cache: new InMemoryCache(),
} );

export const typeToPath = ( type: string, slug: string ): string => {
	switch ( type ) {
		case 'Call':
			return `/calls/${ slug }`;
		case 'Claim':
			return `/claims/${ slug }`;
		case 'Dispute':
			return `/disputes/${ slug }`;
		case 'Provider':
			return `/providers/${ slug }`;
		default:
			return '';
	}
};
