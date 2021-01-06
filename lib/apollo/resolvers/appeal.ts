import {
	QueryResolver,
	TypeResolver,
} from './index';
import { Appeal } from 'lib/db/entities';

import type { AppealStatus } from 'lib/apollo/schema/index.graphqls';

function statusMap( status: string ): AppealStatus {
	switch ( status ) {
		case 'closed':
			return 'CLOSED' as AppealStatus.Closed;
		case 'new':
			return 'NEW' as AppealStatus.New;
		case 'pending':
			return 'PENDING' as AppealStatus.Pending;
		default:
			return 'UNKNOWN' as AppealStatus.Unknown;
	}
}

const getAppeals: QueryResolver<'getAppeals'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ appeals, totalCount ] = await db.em.findAndCount( Appeal, {} );
	return {
		appeals,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const appeal: QueryResolver<'appeal'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const appealData = await db.em.findOne( Appeal, { slug } );
	if ( ! appealData ) {
		return null;
	}
	return appealData;
};

const Resolver: TypeResolver<'Appeal'> = ( {
	async provider( parent ) {
		return parent.provider.load();
	},
	async otherProviders( parent ) {
		return parent.involvedProviders.loadItems();
	},
	async calls( parent ) {
		return parent.calls.loadItems();
	},
	async claims( parent ) {
		return parent.claims.loadItems();
	},
	async notes( parent ) {
		return parent.notes.loadItems();
	},
} );

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
	Resolver: { Appeal: Resolver },
};
