import {
	QueryResolver,
	MutationResolver,
	TypeResolver,
} from './index';
import { Claim } from 'lib/db/entities';

import type { FindManyOptions } from 'typeorm';

const getClaims: QueryResolver<'getClaims'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ claims, totalCount ] = await db.get().findAndCount( 'Claim', { skip: offset, take: limit } as FindManyOptions );
	return {
		claims,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const claim: QueryResolver<'claim'> = async ( parent, { slug } ) => {
	return Claim.findOneOrFail( undefined, { where: { slug } } );
};

const uploadClaims: MutationResolver<'uploadClaims'> = async () => {
	return {
		code: 'success',
		success: true,
		claimsProcessed: 0,
		error: [],
	};
};

const Resolver: TypeResolver<'Claim'> = ( {
	async provider( parent ) {
		return parent.provider;
	},
	async notes( parent ) {
		return parent.notes;
	},
} );

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
	Resolver: { Claim: Resolver },
};
