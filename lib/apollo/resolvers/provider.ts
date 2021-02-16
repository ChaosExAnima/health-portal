import type { MutationResolver, QueryResolver, TypeResolver } from './index';
import { removeNulls } from '../utils';
import type { Provider } from 'lib/db/entities';
import { slugify } from 'lib/strings';

const getProviders: QueryResolver< 'getProviders' > = async (
	parent,
	{ offset = 0, limit = 100 },
	{ dataSources: { db } }
) => {
	const [ providers, totalCount ] = await db.findAndCount< Provider >(
		'Provider',
		offset,
		limit
	);
	return {
		providers,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const getProvider: QueryResolver< 'provider' > = async (
	parent,
	{ slug },
	{ dataSources: { db } }
) => db.findBySlug< Provider >( 'Provider', slug );

const editProvider: MutationResolver< 'provider' > = async (
	parent,
	{ provider: newProvider },
	{ dataSources: { db } }
) => {
	const provider = db.em.create< Provider >( 'Provider', {
		slug: newProvider.slug || slugify( newProvider.name ),
		...removeNulls( newProvider ),
	} );
	if ( newProvider.slug ) {
		const oldProvider = await db.em.findOne< Provider >(
			'Provider',
			undefined,
			{ select: [ 'id', 'slug' ], where: { slug: newProvider.slug } }
		);
		if ( oldProvider ) {
			provider.id = oldProvider.id;
			provider.slug = oldProvider.slug;
		}
	}
	await provider.save();
	return {
		code: 'Success',
		success: true,
	};
};

const Resolver: TypeResolver< 'Provider' > = {};

export default {
	Query: { getProviders, provider: getProvider },
	Mutation: { provider: editProvider },
	Resolver: { Provider: Resolver },
};
