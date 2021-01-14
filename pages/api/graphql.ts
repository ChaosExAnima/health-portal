import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { RequestContext } from '@mikro-orm/core';

import initOrm from 'lib/db';
import dataSources from 'lib/apollo/datasources';
import { makeSchema } from 'lib/apollo/schema';

const schema = makeSchema();

const ormPromise = initOrm();

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler( req: NextApiRequest, res: NextApiResponse ): Promise<void> {
	const orm = await ormPromise;
	RequestContext.create( orm.em, () => null );
	const apolloServer = new ApolloServer( {
		schema,
		dataSources: () => dataSources( orm ),
		debug: process.env.DB_DEBUG === 'true',
	} );

	const apollo = apolloServer.createHandler( { path: '/api/graphql' } );
	return apollo( req, res );
}
