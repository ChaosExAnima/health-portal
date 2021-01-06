import { Provider } from 'lib/db/entities';

import {
	QueryResolver,
	TypeResolver,
} from './index';

const getProviders: QueryResolver<'getProviders'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ providers, totalCount ] = await db.em.findAndCount( Provider, {} );
	return {
		providers,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const provider: QueryResolver<'provider'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	return db.em.findOne( Provider, { slug } );
};

const Resolver: TypeResolver<'Provider'> = ( {
	async notes( parent ) {
		return parent.notes.loadItems();
	},
} );

export default {
	Query: { getProviders, provider },
	Mutation: {},
	Resolver: { Provider: Resolver },
};
