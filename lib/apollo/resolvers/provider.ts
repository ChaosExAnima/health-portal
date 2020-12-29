import { Provider } from 'lib/db/entities';

import type { Mapper, QueryResolver } from './index';
import type { Provider as ProviderGQL } from 'lib/apollo/schema/index.graphqls';

export const map: Mapper<Provider, ProviderGQL> = ( provider ) => ( {
	...provider,
} );

const getProviders: QueryResolver<'getProviders'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ providersData, totalCount ] = await db.em.findAndCount( Provider, {} );
	return {
		providers: providersData.map( map ),
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const provider: QueryResolver<'provider'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const providerData = await db.em.findOneOrFail( Provider, { slug } );
	return map( providerData );
};

export default {
	Query: { getProviders, provider },
	Mutation: {},
};
