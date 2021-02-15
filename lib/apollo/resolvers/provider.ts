import type {
	QueryResolver,
	TypeResolver,
} from './index';
import type { Provider } from 'lib/db/entities';

const getProviders: QueryResolver<'getProviders'> = async ( parent, { offset = 0, limit = 100 }, { dataSources: { db } } ) => {
	const [ providers, totalCount ] = await db.findAndCount< Provider >( 'Provider', offset, limit );
	return {
		providers,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const provider: QueryResolver<'provider'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	return db.findBySlug< Provider >( 'Provider', slug );
};

const Resolver: TypeResolver<'Provider'> = ( {
} );

export default {
	Query: { getProviders, provider },
	Mutation: {},
	Resolver: { Provider: Resolver },
};
