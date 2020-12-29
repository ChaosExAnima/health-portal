import { Call } from 'lib/db/entities';

import type { Call as CallGQL } from 'lib/apollo/schema/index.graphqls';
import type { Mapper, QueryResolver } from './index';

export const map: Mapper<Call, CallGQL> = ( call ) => ( {
	...call,
	date: call.created,
} );

const getCalls: QueryResolver<'getCalls'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ callsData, totalCount ] = await db.em.findAndCount( Call, {} );
	return {
		calls: callsData.map( map ),
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const call: QueryResolver<'call'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const callData = await db.em.findOneOrFail( Call, { slug } );
	return map( callData );
};

export default {
	Query: { getCalls, call },
	Mutation: {},
};
