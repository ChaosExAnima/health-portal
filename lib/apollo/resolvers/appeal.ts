import {
	Mapper,
	QueryResolver,
	maps,
	TypeResolver,
} from './index';
import { Appeal, Provider } from 'lib/db/entities';

import type {
	Appeal as AppealGQL,
	AppealStatus,
} from 'lib/apollo/schema/index.graphqls';

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

export const map: Mapper<Appeal, AppealGQL> = ( appeal ) => ( {
	...appeal,
	date: appeal.created,
	calls: appeal.calls.toArray().map( maps.callMap ),
	claims: appeal.claims.toArray().map( maps.claimMap ),
	provider: maps.providerMap( appeal.provider ),
	status: statusMap( appeal.status ),
} );

const getAppeals: QueryResolver<'getAppeals'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ appealsData, totalCount ] = await db.em.findAndCount( Appeal, {} );
	return {
		appeals: appealsData.map( map ),
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const appeal: QueryResolver<'appeal'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const appealData = await db.em.findOneOrFail( Appeal, { slug } );
	return map( appealData );
};

const Resolver: TypeResolver<'Appeal'> = ( {
	provider( parent, {}, { dataSources: { db } } ) {
		return db.em.findOne( Provider, { id: parent.provider.id } ) as Promise<Provider>;
	},
	async claims( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOne( Appeal, { id: parent.id } );
		const claims = await parentObj?.claims.loadItems();
		if ( ! claims ) {
			return [];
		}
		return claims.map( maps.claimMap );
	},
} );

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
	Resolver: { Appeal: Resolver },
};
