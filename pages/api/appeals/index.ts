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
import type { Appeal } from 'lib/entities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type AppealsResponse = RecordsResponse< Appeal > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< AppealsResponse >
) {
	const respond = respondWithStatus< AppealsResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getAppeals( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertAppeal( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getAppeals(
	query: any
): Promise< WithStatus< RecordsResponse< Appeal > > > {
	const [
		{ queryEntities },
		{ queryAppeals },
		{ rowToAppeal },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/db/helpers' ),
		import( 'lib/entities/appeal' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const appeals = await queryAppeals().limit( limit ).offset( offset );
	const records = appeals.map( ( row ) => rowToAppeal( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertAppeal(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveAppeal },
		{ appealSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/appeal' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, appealSchema, saveAppeal );
}
