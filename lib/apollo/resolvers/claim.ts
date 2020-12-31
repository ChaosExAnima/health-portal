import {
	QueryResolver,
	MutationResolver,
	TypeResolver,
} from './index';
import { Claim } from 'lib/db/entities';

import type {
	ClaimStatus,
	ClaimType,
} from 'lib/apollo/schema/index.graphqls';

function statusMap( status: string ): ClaimStatus {
	switch ( status ) {
		case 'approved':
			return 'APPROVED' as ClaimStatus.Approved;
		case 'deleted':
			return 'DELETED' as ClaimStatus.Deleted;
		case 'denied':
			return 'DENIED' as ClaimStatus.Denied;
		case 'pending':
			return 'PENDING' as ClaimStatus.Pending;
		default:
			return 'UNKNOWN' as ClaimStatus.Unknown;
	}
}

function typeMap( type: string ): ClaimType {
	switch ( type ) {
		case 'dental':
			return 'DENTAL' as ClaimType.Dental;
		case 'in-network':
			return 'INNETWORK' as ClaimType.Innetwork;
		case 'out-of-network':
			return 'OUTOFNETWORK' as ClaimType.Outofnetwork;
		case 'pharmacy':
			return 'PHARMACY' as ClaimType.Pharmacy;
		default:
			return 'OTHER' as ClaimType.Other;
	}
}

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
	return db.em.findOneOrFail( Claim, { slug } );
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
	claim( parent ) {
		return parent.number;
	},
	async provider( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Claim, { id: parent.id }, [ 'provider' ] );
		return parentObj.provider;
	},
	async notes( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Claim, { id: parent.id }, [ 'notes' ] );
		return parentObj.notes.toArray();
	},
} );

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
	Resolver: { Claim: Resolver },
};
