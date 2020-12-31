import Appeal from './appeal';
import Call from './call';
import Claim from './claim';
import Provider from './provider';
import Note from './note';

import type { ResolverContext } from 'lib/apollo';
import type {
	QueryResolvers,
	MutationResolvers,
	Resolvers,
} from 'lib/apollo/schema/index.graphqls';

export type QueryResolver<T extends keyof QueryResolvers<ResolverContext>> = QueryResolvers<ResolverContext>[T];
export type MutationResolver<T extends keyof MutationResolvers<ResolverContext>> = MutationResolvers<ResolverContext>[T];
export type TypeResolver<T extends keyof Resolvers<ResolverContext>> = Resolvers<ResolverContext>[T];

const Query: Required<QueryResolvers<ResolverContext>> = {
	...Appeal.Query,
	...Call.Query,
	...Claim.Query,
	...Provider.Query,
	...Note.Query,
	history() {
		return [];
	},
};

const Mutation: Required<MutationResolvers<ResolverContext>> = {
	...Appeal.Mutation,
	...Call.Mutation,
	...Claim.Mutation,
	...Provider.Mutation,
	...Note.Mutation,
};

export default {
	Query,
	Mutation,
	...Appeal.Resolver,
	...Call.Resolver,
	...Claim.Resolver,
	...Note.Resolver,
	...Provider.Resolver,
};
