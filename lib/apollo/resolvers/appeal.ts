import type {
	QueryResolver,
	TypeResolver,
} from './index';

import type {
	Appeal,
	Call,
	Claim,
	Note,
	Provider,
} from 'lib/db/entities';

const getAppeals: QueryResolver<'getAppeals'> = async ( parent, { offset = 0, limit = 100 }, { dataSources: { db } } ) => {
	const [ appeals, totalCount ] = await db.findAndCount<Appeal>( 'Appeal', offset, limit );
	return {
		appeals,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const appeal: QueryResolver<'appeal'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const appealData = await db.findBySlug<Appeal>( 'Appeal', slug );
	if ( ! appealData ) {
		return null;
	}
	return appealData;
};

const Resolver: TypeResolver<'Appeal'> = ( {
	async provider( parent, {}, { dataSources: { db } } ) {
		return db.loader<Appeal, Provider>( 'Appeal', 'provider' ).load( parent.id );
	},
	async otherProviders( parent, {}, { dataSources: { db } } ) {
		return db.loader<Appeal, Provider[]>( 'Appeal', 'involvedProviders' ).load( parent.id );
	},
	async calls( parent, {}, { dataSources: { db } } ) {
		return db.loader<Appeal, Call[]>( 'Appeal', 'calls' ).load( parent.id );
	},
	async claims( parent, {}, { dataSources: { db } } ) {
		return db.loader<Appeal, Claim[]>( 'Appeal', 'claims' ).load( parent.id );
	},
	async notes( parent, {}, { dataSources: { db } } ) {
		return db.loader<Appeal, Note[]>( 'Appeal', 'notes' ).load( parent.id );
	},
} );

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
	Resolver: { Appeal: Resolver },
};
