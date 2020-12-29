import {
	QueryResolver,
	MutationResolver,
	Mapper,
	maps,
} from './index';
import { Claim } from 'lib/db/entities';

import type {
	Claim as ClaimGQL,
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

export const map: Mapper<Claim, ClaimGQL> = ( claim ) => ( {
	...claim,
	claim: claim.number || 'Unknown',
	date: claim.serviceDate,
	provider: maps.providerMap( claim.provider ),
	status: statusMap( claim.status ),
	type: typeMap( claim.type ),
} );

const getClaims: QueryResolver<'getClaims'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ claimsData, totalCount ] = await db.em.findAndCount( Claim, {} );
	return {
		claims: claimsData.map( map ),
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const claim: QueryResolver<'claim'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	const claimData = await db.em.findOneOrFail( Claim, { slug } );
	return map( claimData );
};

const uploadClaims: MutationResolver<'uploadClaims'> = async () => {
	return {
		code: 'success',
		success: true,
		claimsProcessed: 0,
		error: [],
	};
};

export default {
	Query: { getClaims, claim },
	Mutation: { uploadClaims },
};
