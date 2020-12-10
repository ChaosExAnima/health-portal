import casual from 'casual';
import { ApolloServer, MockList } from 'apollo-server-micro';
import { typeDefs } from './schemas';

const mocks = {
	Provider: () => ( {
		name: casual.name,
		location: casual._address,
	} ),
	Claim: () => ( {
		claim: casual.card_number(),
		billed: casual.integer( 50, 50000 ),
		cost: casual.integer( 0, 50 ),
		date: casual.date( 'x' ),
	} ),
	ClaimResponse: ( parent: never, args: { offset?: number } ) => ( {
		totalCount: 240,
		claims: () => new MockList( args.offset && args.offset > 220 ? Math.max( 240 - args.offset, 0 ) : 20 ),
	} ),
};

const apolloServer = new ApolloServer( { typeDefs, mocks } );

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler( { path: '/api/graphql' } );
