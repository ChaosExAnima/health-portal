import type {
	Appeal,
	Call,
	Claim,
	Note,
	Provider,
	Representative,
} from 'lib/db/entities';
import type { QueryResolver, TypeResolver } from './index';

const getCalls: QueryResolver< 'getCalls' > = async (
	parent,
	{ offset = 0, limit = 100 },
	{ dataSources: { db } }
) => {
	const [ calls, totalCount ] = await db.findAndCount< Call >(
		'Call',
		offset,
		limit
	);
	return {
		calls,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const call: QueryResolver< 'call' > = async (
	parent,
	{ slug },
	{ dataSources: { db } }
) => {
	return db.findBySlug< Call >( 'Call', slug );
};

const Resolver: TypeResolver< 'Call' > = {
	provider( parent, {}, { dataSources: { db } } ) {
		return db
			.loader< Call, Provider >( 'Call', 'provider' )
			.load( parent.id );
	},
	claims( parent, {}, { dataSources: { db } } ) {
		return db.loader< Call, Claim[] >( 'Call', 'claims' ).load( parent.id );
	},
	appeals( parent, {}, { dataSources: { db } } ) {
		return db
			.loader< Call, Appeal[] >( 'Call', 'appeals' )
			.load( parent.id );
	},
	note( parent, {}, { dataSources: { db } } ) {
		return db.loader< Call, Note >( 'Call', 'note' ).load( parent.id );
	},
	async reps( parent, {}, { dataSources: { db } } ) {
		const loader = db.loader< Call, Representative[] >( 'Call', 'reps' );
		const reps = await loader.load( parent.id );
		return reps.map( ( { name } ) => name );
	},
};

export default {
	Query: { getCalls, call },
	Mutation: {},
	Resolver: { Call: Resolver },
};
