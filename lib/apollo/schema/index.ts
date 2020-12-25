import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { addMocksToSchema } from '@graphql-tools/mock';
import type { GraphQLSchema } from 'graphql';
import casual from 'casual';
import { MockList } from 'apollo-server-micro';

const mocks = {
	Slug: () => casual.array_of_words( casual.integer( 2, 4 ) ).join( '-' ),
	Date: () => casual.date( 'M/D/YYYY' ),
	DateTime: () => casual.date( 'M/D/YYYY HH:SS' ),
	Provider: () => ( {
		name: casual.name,
		slug: casual.string,
	} ),
	Claim: () => ( {
		claim: casual.card_number(),
		billed: casual.integer( 50, 50000 ),
		cost: casual.integer( 0, 50 ),
		owed: casual.integer( 0, 50 ),
		history: () => new MockList( [ 0, 10 ] ),
	} ),
	ClaimResponse: ( parent: never, args: { offset?: number, limit?: number } ) => ( {
		totalCount: 240,
		claims: () => new MockList( Math.min( 240, args.limit || 20 ) ),
	} ),
	Call: () => ( {
		notes: casual.sentence,
	} ),
	Dated: () => ( {
	} ),
	Dispute: () => ( {
		slug: casual.string,
	} ),
	Event: () => ( {
		description: casual.sentence,
	} ),
	UploadClaimsResponse: () => (
		casual.coin_flip
			? {
				code: '200',
				success: true,
				claimsProcessed: casual.integer( 100, 200 ),
				errors: undefined,
			}
			: {
				code: 'missing-headers',
				success: false,
				claimsProcessed: undefined,
				errors: [ casual.sentence ],
			}
	),
};

export function makeSchema(): GraphQLSchema {
	const loadedFiles = loadFilesSync( join( process.cwd(), 'lib/apollo/schema/*.graphqls' ) );
	const typeDefs = mergeTypeDefs( loadedFiles );
	const schema = makeExecutableSchema( {
		typeDefs,
	} );

	return addMocksToSchema( { schema, mocks } );
}
