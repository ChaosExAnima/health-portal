import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import type { GraphQLSchema } from 'graphql';

import resolvers from 'lib/apollo/resolvers';

export function makeSchema(): GraphQLSchema {
	const loadedFiles = loadFilesSync( join( process.cwd(), 'lib/apollo/schema/*.graphqls' ) );
	const typeDefs = mergeTypeDefs( loadedFiles );
	return makeExecutableSchema( {
		typeDefs,
		resolvers,
	} );
}
