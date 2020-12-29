import { ApolloServer } from 'apollo-server-micro';

import initOrm from 'lib/db';
import MikroAPI from 'lib/apollo/datasource';
import { makeSchema } from 'lib/apollo/schema';

const schema = makeSchema();

const orm = initOrm();

const apolloServer = new ApolloServer( {
	schema,
	dataSources: () => ( {
		db: new MikroAPI( orm ),
	} ),
	debug: process.env.DB_DEBUG === 'true',
} );

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler( { path: '/api/graphql' } );
