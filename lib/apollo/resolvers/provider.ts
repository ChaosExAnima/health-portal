import { editAndSave, mutationResponse, removeChars } from '../utils';
import { slugify } from 'lib/strings';

import type { Provider } from 'lib/db/entities';
import type { MutationResolver, QueryResolver, TypeResolver } from './index';

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
	const providerData = {
		slug: newProvider.slug || slugify( newProvider.name ),
		...removeChars( newProvider, [ null, '' ] ),
	};

	try {
		await editAndSave< Provider >( 'provider', db, providerData );
		return mutationResponse();
	} catch ( error ) {
		return mutationResponse( error );
	}
};

const Resolver: TypeResolver< 'Provider' > = {};

export default {
	Query: { getProviders, provider: getProvider },
	Mutation: { provider: editProvider },
	Resolver: { Provider: Resolver },
};
