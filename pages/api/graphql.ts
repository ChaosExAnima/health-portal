import { ApolloServer } from 'apollo-server-micro';

import initOrm from 'lib/db';
import MikroAPI from 'lib/apollo/datasource';
import { makeSchema } from 'lib/apollo/schema';
import resolvers from 'lib/apollo/resolvers';

const schema = makeSchema();

const orm = initOrm();

const apolloServer = new ApolloServer( {
	schema,
	resolvers,
	dataSources: () => ( {
		db: new MikroAPI( orm ),
	} ),
} );

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler( { path: '/api/graphql' } );
