import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';

import initOrm from 'lib/db';
import dataSources from 'lib/apollo/datasources';
import { makeSchema } from 'lib/apollo/schema';

const schema = makeSchema();

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler( req: NextApiRequest, res: NextApiResponse ): Promise<void> {
	const connection = await initOrm();
	const apolloServer = new ApolloServer( {
		schema,
		dataSources: () => dataSources( connection ),
		debug: process.env.DB_DEBUG === 'true',
	} );

	const apollo = apolloServer.createHandler( { path: '/api/graphql' } );
	return apollo( req, res );
}
