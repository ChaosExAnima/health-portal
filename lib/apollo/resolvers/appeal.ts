import {
	QueryResolver,
	TypeResolver,
} from './index';
import { Appeal } from 'lib/db/entities';
import { FindManyOptions } from 'typeorm';

const getAppeals: QueryResolver<'getAppeals'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ appeals, totalCount ] = await db.get().findAndCount( 'Appeal', { skip: offset, take: limit } as FindManyOptions );
	return {
		appeals,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const appeal: QueryResolver<'appeal'> = async ( parent, { slug } ) => {
	const appealData = await Appeal.findOne( { slug } );
	if ( ! appealData ) {
		return null;
	}
	return appealData;
};

const Resolver: TypeResolver<'Appeal'> = ( {
	async provider( parent ) {
		return parent.provider;
	},
	async otherProviders( parent ) {
		return parent.involvedProviders;
	},
	async calls( parent ) {
		return parent.calls;
	},
	async claims( parent ) {
		return parent.claims;
	},
	async notes( parent ) {
		return parent.notes;
	},
} );

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
	Resolver: { Appeal: Resolver },
};
