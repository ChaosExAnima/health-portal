import {
	QueryResolver,
	TypeResolver,
} from './index';
import {
	Appeal,
	Call,
	Claim,
	Note,
	Provider,
} from 'lib/db/entities';

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
	async provider( parent, {}, { dataSources: { db } } ) {
		return db.em.findOneOrFail( Provider, { id: parent.provider.id } );
	},
	async otherProviders( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Appeal, { id: parent.id }, [ 'involvedProviders' ] );
		return parentObj.involvedProviders.toArray() as Provider[];
	},
	async calls( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Appeal, { id: parent.id }, [ 'calls' ] );
		return parentObj.calls.toArray() as Call[];
	},
	async claims( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Appeal, { id: parent.id }, [ 'claims' ] );
		return parentObj.claims.toArray() as Claim[];
	},
	async notes( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Appeal, { id: parent.id }, [ 'notes' ] );
		return parentObj.notes.toArray() as Note[];
	},
} );

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
	Resolver: { Appeal: Resolver },
};
