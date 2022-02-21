import { NotFoundError } from 'lib/api/errors';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Note } from 'lib/entities/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< Note > | EntityUpdateResponse >
) {
	const {
		query: { slug },
		body,
		method,
	} = req;
	const respond = respondWithStatus( res );
	try {
		checkMethod( method );
		const record = await getContentBySlug(
			'call',
			fromArray( slug ) as string
		);
		if ( ! record ) {
			throw new NotFoundError();
		}
		if ( method === 'POST' ) {
			respond( await saveCall( body, record.id ) );
		} else if ( method === 'GET' ) {
			const { rowToCall } = await import( 'lib/entities/call' );
			const response = {
				success: true,
				status: 200,
				record: rowToCall( record ),
			};
			respond( response );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function saveCall( body: any, id: number ) {
	const [
		{ saveEntity },
		{ callSchema },
		{ saveCall },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/schemas' ),
		import( 'lib/entities/call' ),
	] );
	const input = { ...body, id };
	return saveEntity( input, callSchema, saveCall );
}
