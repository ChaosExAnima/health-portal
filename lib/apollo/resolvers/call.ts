import {
	QueryResolver,
	TypeResolver,
} from './index';
import {
	Appeal,
	Call,
	Claim,
	Representative,
} from 'lib/db/entities';

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
	async provider( parent, args, { dataSources: { provider } } ) {
		return provider.loadOrFail( parent.provider?.id );
	},
	claims( parent, args, { dataSources: { call: callDB } } ) {
		return callDB.loadCollection<Claim>( parent.id, 'claims' );
	},
	appeals( parent, args, { dataSources: { call: callDB } } ) {
		return callDB.loadCollection<Appeal>( parent.id, 'appeals' );
	},
	async note( parent, args, { dataSources: { note } } ) {
		return note.load( parent.note?.id );
	},
	async reps( parent, args, { dataSources: { call: callDB } } ) {
		const reps = await callDB.loadCollection<Representative>( parent.id, 'reps' );
		return reps.map( ( { name } ) => name );
	},
} );

export default {
	Query: { getCalls, call },
	Mutation: {},
	Resolver: { Call: Resolver },
};
