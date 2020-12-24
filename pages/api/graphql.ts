import { ApolloServer } from 'apollo-server-micro';

import { makeSchema } from 'lib/apollo';

const apolloServer = new ApolloServer( { schema: makeSchema() } );

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler( { path: '/api/graphql' } );
