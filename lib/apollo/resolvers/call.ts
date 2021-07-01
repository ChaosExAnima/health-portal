import dayjs from 'dayjs';

import { slugify } from 'lib/strings';

import type {
	Appeal,
	Call,
	Claim,
	Note,
	Provider,
	Representative,
} from 'lib/db/entities';
import type { MutationResolver, QueryResolver, TypeResolver } from './index';

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

const newCall: MutationResolver< 'newCall' > = async (
	parent,
	{ call: input },
	{ dataSources: { db } }
) => {
	const query = db.em.createQueryBuilder();
	const notes = await query
		.insert()
		.into< Note >( 'Note' )
		.values(
			input.notes.map( ( note ) => ( {
				description: note.description,
				due: note.due || undefined,
			} ) )
		)
		.execute();
	const date = dayjs( input.date );
	const inserted = db.em.create< Call >( 'Call', {
		slug: slugify( date.toISOString() ),
		created: date.toDate(),
	} );

	await inserted.save();

	return {
		code: 'success',
		success: true,
		call: inserted,
	};
};

const Resolver: TypeResolver< 'Call' > = {
	providers( parent, {}, { dataSources: { db } } ) {
		return db
			.loader< Call, Provider[] >( 'Call', 'provider' )
			.load( parent.id );
	},
	notes( parent, {}, { dataSources: { db } } ) {
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
	Mutation: { newCall },
	Resolver: { Call: Resolver },
};
