import Claim from 'lib/db/entities/claim';
import parseCSV from 'lib/parser';

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
		const claimsProcessed = await parseCSV( stream, db.em );

		return {
			code: 'success',
			success: true,
			claimsProcessed,
		};
	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.error( err );
		let code = 'unknown';
		if ( err instanceof Error ) {
			code = err.name;
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
