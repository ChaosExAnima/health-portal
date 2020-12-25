import { ApolloServer } from 'apollo-server-micro';

import { makeSchema } from 'lib/apollo/schema';

const schema = makeSchema();

const apolloServer = new ApolloServer( { schema } );

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler( { path: '/api/graphql' } );
