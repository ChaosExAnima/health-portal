import { log } from 'lib/apollo/utils';
import Claim from 'lib/db/entities/claim';
import ImportParser from 'lib/parser';

import type { QueryResolver, MutationResolver, TypeResolver } from './index';
import type { Note, Provider } from 'lib/db/entities';

const getClaims: QueryResolver< 'getClaims' > = async (
	parent,
	{ offset = 0, limit = 100 },
	{ dataSources: { db } }
) => {
	const [ claims, totalCount ] = await db.findAndCount< Claim >(
		'Claim',
		offset,
		limit
	);
	return {
		claims,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const claim: QueryResolver< 'claim' > = async (
	parent,
	{ slug },
	{ dataSources: { db } }
) => {
	return db.findBySlug( 'Claim', slug );
};

const uploadClaims: MutationResolver< 'uploadClaims' > = async (
	parent,
	{ file },
	{ dataSources: { db } }
) => {
	try {
		const { createReadStream } = await file;
		const stream = createReadStream();
		const parser = new ImportParser( db.em );
		await parser.parse( stream );

		return {
			code: 'success',
			success: true,
			claimsProcessed: parser.getTotalUpdated(),
		};
	} catch ( err ) {
		log( err );
		let code = 'unknown';
		if ( err instanceof Error ) {
			code = err.message;
		}
		return {
			code,
			success: false,
			claimsProcessed: 0,
		};
	}
};

const Resolver: TypeResolver< 'Claim' > = {
	async provider( parent, {}, { dataSources: { db } } ) {
		return db
			.loader< Claim, Provider >( 'Claim', 'provider' )
			.load( parent.id );
	},
	async notes( parent, {}, { dataSources: { db } } ) {
		return db.loader< Claim, Note[] >( 'Claim', 'notes' ).load( parent.id );
	},
};

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
	Resolver: { Claim: Resolver },
};
