import Appeal, { map as appealMap } from './appeal';
import Call, { map as callMap } from './call';
import Claim, { map as claimMap } from './claim';
import Provider, { map as providerMap } from './provider';

import type { ResolverContext } from 'lib/apollo';
import type { BaseEntity } from 'lib/db/entities/base';
import type { QueryResolvers, MutationResolvers } from 'lib/apollo/schema/index.graphqls';

export type QueryResolver<T extends keyof QueryResolvers<ResolverContext>> = QueryResolvers<ResolverContext>[T];
export type MutationResolver<T extends keyof MutationResolvers<ResolverContext>> = MutationResolvers<ResolverContext>[T];
export type Mapper<T extends BaseEntity, K> = ( arg0: T ) => K;

export const maps = {
	appealMap,
	callMap,
	claimMap,
	providerMap,
};

const Query: Required<QueryResolvers<ResolverContext>> = {
	...Appeal.Query,
	...Call.Query,
	...Claim.Query,
	...Provider.Query,
	async history( context, { type, id }, { dataSources: { db } } ) {
		return [];
	},
};

const Mutation: Required<MutationResolvers<ResolverContext>> = {
	...Appeal.Mutation,
	...Call.Mutation,
	...Claim.Mutation,
	...Provider.Mutation,
};

export default { Query, Mutation };
