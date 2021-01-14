import { ApolloServer } from 'apollo-server-micro';

import initOrm from 'lib/db';
import MikroAPI from 'lib/apollo/datasource';
import { makeSchema } from 'lib/apollo/schema';
import { RequestContext } from '@mikro-orm/core';
import { NextApiRequest, NextApiResponse } from 'next';

const schema = makeSchema();

const orm = initOrm();

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler( req: NextApiRequest, res: NextApiResponse ): Promise<void> {
	RequestContext.create( ( await orm ).em, () => null );
	const apolloServer = new ApolloServer( {
		schema,
		dataSources: () => ( {
			db: new MikroAPI( orm ),
		} ),
		debug: process.env.DB_DEBUG === 'true',
	} );

	const apollo = apolloServer.createHandler( { path: '/api/graphql' } );
	return apollo( req, res );
}
