import {
	QueryResolver,
	MutationResolver,
	TypeResolver,
} from './index';
import { Claim } from 'lib/db/entities';

const getClaims: QueryResolver<'getClaims'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ claims, totalCount ] = await db.em.findAndCount( Claim, {} );
	return {
		claims,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const claim: QueryResolver<'claim'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	return db.em.findOne( Claim, { slug } );
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
	date( parent ) {
		return parent.created;
	},
	claim( parent ) {
		return parent.number || null;
	},
	async provider( parent ) {
		return parent.provider.load();
	},
	async notes( parent ) {
		return parent.notes.loadItems();
	},
} );

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
	Resolver: { Claim: Resolver },
};
