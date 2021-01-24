import { Call } from 'lib/db/entities';

import type { FindManyOptions } from 'typeorm';
import type {
	QueryResolver,
	TypeResolver,
} from './index';

const getCalls: QueryResolver<'getCalls'> = async ( parent, { offset = 0, limit = 100 }, { dataSources: { db } } ) => {
	const [ calls, totalCount ] = await db.get().findAndCount( 'Call', { skip: offset, take: limit } as FindManyOptions );
	return {
		calls,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const call: QueryResolver<'call'> = async ( parent, { slug } ) => {
	return Call.findOneOrFail( undefined, { where: { slug } } );
};

const Resolver: TypeResolver<'Call'> = ( {
	provider( parent ) {
		return parent.provider;
	},
	claims( parent ) {
		return parent.claims;
	},
	appeals( parent ) {
		return parent.appeals;
	},
	note( parent ) {
		return parent.note || null;
	},
	async reps( parent ) {
		const reps = await parent.reps;
		return reps.map( ( { name } ) => name );
	},
} );

export default {
	Query: { getCalls, call },
	Mutation: {},
	Resolver: { Call: Resolver },
};
