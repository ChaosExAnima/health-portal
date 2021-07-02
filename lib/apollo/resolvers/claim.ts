import { log } from 'lib/apollo/utils';
import Claim from 'lib/db/entities/claim';
import parseCSV from 'lib/parser';

import type { QueryResolver, MutationResolver, TypeResolver } from './index';
import { Content, Note, Provider } from 'lib/db/entities';

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
	claim( parent ) {
		return parent.number;
	},
	async provider( parent, {}, { dataSources: { db } } ) {
		return db
			.loader< Claim, Provider >( 'Claim', 'provider' )
			.load( parent.id );
	},
	async notes( parent, {}, { dataSources: { db } } ) {
		// return ( await parent.relations ).filter(
		// 	( rel ) => rel instanceof Note
		// ) as Note[];

		// return db.em
		// 	.createQueryBuilder< Claim >( 'Claim', 'claim' )
		// 	.leftJoinAndSelect( 'claim.relations', 'note' )
		// 	.where( 'claim.id = :id', parent )
		// 	.execute();

		const loaded = await db
			.loader< Claim, Content[] >( 'Claim', 'relations' )
			.load( parent.id );
		console.log( loaded );
		return loaded.filter( ( rel ) => rel instanceof Note ) as Note[];
	},
};

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
	Resolver: { Claim: Resolver },
};
