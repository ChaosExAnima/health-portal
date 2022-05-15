import { queryEntities } from 'lib/api/entities';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';

import type {
	EntityUpdateResponse,
	RecordsResponse,
	WithStatus,
} from 'lib/api/types';
import type { Claim } from 'lib/entities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type ClaimsResponse = RecordsResponse< Claim > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< ClaimsResponse >
) {
	const respond = respondWithStatus< ClaimsResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getClaims( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertClaim( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getClaims(
	query: any
): Promise< WithStatus< RecordsResponse< Claim > > > {
	const [ { queryClaims }, { rowToClaim } ] = await Promise.all( [
		import( 'lib/db/helpers' ),
		import( 'lib/entities/claim' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const claims = await queryClaims().limit( limit ).offset( offset );
	const records = claims.map( ( row ) => rowToClaim( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertClaim(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveClaim },
		{ claimSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/claim' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, claimSchema, saveClaim );
}
