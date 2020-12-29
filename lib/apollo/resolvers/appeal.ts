import {
	Mapper,
	QueryResolver,
	maps,
} from './index';
import { Appeal } from 'lib/db/entities';

import type { Appeal as AppealGQL, AppealStatus } from 'lib/apollo/schema/index.graphqls';

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
	calls: appeal.calls.map( maps.callMap ),
	claims: appeal.claims.map( maps.claimMap ),
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

export default {
	Query: { getAppeals, appeal },
	Mutation: {},
};
