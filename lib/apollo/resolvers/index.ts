import dayjs from 'dayjs';
import { GraphQLScalarType } from 'graphql';

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
	DateScalarConfig,
	DateTimeScalarConfig,
} from 'lib/apollo/schema/index.graphqls';

export type QueryResolver<
	T extends keyof QueryResolvers< ResolverContext >
> = QueryResolvers< ResolverContext >[ T ];
export type MutationResolver<
	T extends keyof MutationResolvers< ResolverContext >
> = MutationResolvers< ResolverContext >[ T ];
export type TypeResolver<
	T extends keyof Resolvers< ResolverContext >
> = Resolvers< ResolverContext >[ T ];

const Query: Required< QueryResolvers< ResolverContext > > = {
	...Appeal.Query,
	...Call.Query,
	...Claim.Query,
	...Provider.Query,
	...Note.Query,
	history() {
		return [];
	},
};

const Mutation: Required< MutationResolvers< ResolverContext > > = {
	...Appeal.Mutation,
	...Call.Mutation,
	...Claim.Mutation,
	...Provider.Mutation,
	...Note.Mutation,
};

const Date = new GraphQLScalarType( {
	name: 'Date',
	serialize( value: Date ) {
		return dayjs( value ).format( 'M/D/YY' );
	},
} as DateScalarConfig );

const DateTime = new GraphQLScalarType( {
	name: 'DateTime',
	serialize( value: Date ) {
		return dayjs( value ).format( 'M/D/YY h:mm A' );
	},
} as DateTimeScalarConfig );

export default {
	Query,
	Mutation,
	...Appeal.Resolver,
	...Call.Resolver,
	...Claim.Resolver,
	...Note.Resolver,
	...Provider.Resolver,
	Date,
	DateTime,
};
