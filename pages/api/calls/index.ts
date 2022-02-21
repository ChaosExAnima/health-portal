import { queryEntities } from 'lib/api/entities';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type {
	EntityUpdateResponse,
	RecordsResponse,
	WithStatus,
} from 'lib/api/types';
import type { Call } from 'lib/entities/types';

type CallsResponse = RecordsResponse< Call > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< CallsResponse >
) {
	const respond = respondWithStatus< CallsResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getCalls( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertCall( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getCalls(
	query: any
): Promise< WithStatus< RecordsResponse< Call > > > {
	const [ { queryCalls }, { rowToCall } ] = await Promise.all( [
		import( 'lib/db/helpers' ),
		import( 'lib/entities/call' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const calls = await queryCalls().limit( limit ).offset( offset );
	const records = calls.map( ( row ) => rowToCall( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertCall(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveCall },
		{ callSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/call' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, callSchema, saveCall );
}
