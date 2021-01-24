import { Provider } from 'lib/db/entities';
import {
	QueryResolver,
	TypeResolver,
} from './index';

import type { FindManyOptions } from 'typeorm';

const getProviders: QueryResolver<'getProviders'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ providers, totalCount ] = await db.get().findAndCount( 'Provider', { skip: offset, take: limit } as FindManyOptions );
	return {
		providers,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const provider: QueryResolver<'provider'> = async ( parent, { slug } ) => {
	return Provider.findOneOrFail( undefined, { where: { slug } } );
};

const Resolver: TypeResolver<'Provider'> = ( {
	async notes( parent ) {
		return parent.notes;
	},
} );

export default {
	Query: { getProviders, provider },
	Mutation: {},
	Resolver: { Provider: Resolver },
};
