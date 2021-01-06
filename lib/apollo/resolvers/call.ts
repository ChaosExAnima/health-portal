import {
	QueryResolver,
	TypeResolver,
} from './index';
import { Call } from 'lib/db/entities';

const getCalls: QueryResolver<'getCalls'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ calls, totalCount ] = await db.em.findAndCount( Call, {} );
	return {
		calls,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const call: QueryResolver<'call'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	return db.em.findOneOrFail( Call, { slug } );
};

const Resolver: TypeResolver<'Call'> = ( {
	date( parent ) {
		return parent.created;
	},
	async provider( parent ) {
		return parent.provider.load();
	},
	async claims( parent ) {
		return parent.claims.loadItems();
	},
	async appeals( parent ) {
		return parent.appeals.loadItems();
	},
	async note( parent ) {
		return parent.note?.load() || null;
	},
} );

export default {
	Query: { getCalls, call },
	Mutation: {},
	Resolver: { Call: Resolver },
};
