import { NotFoundError } from 'lib/api/errors';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';

import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Note } from 'lib/entities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

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
			'note',
			fromArray( slug ) as string
		);
		if ( ! record ) {
			throw new NotFoundError();
		}
		if ( method === 'POST' ) {
			respond( await saveNote( body, record.id ) );
		} else if ( method === 'GET' ) {
			const { rowToNote } = await import( 'lib/entities/note' );
			const response = {
				success: true,
				status: 200,
				record: rowToNote( record ),
			};
			respond( response );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function saveNote( body: any, id: number ) {
	const [
		{ saveEntity },
		{ noteSchema },
		{ saveNote },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/schemas' ),
		import( 'lib/entities/note' ),
	] );
	const input = { ...body, id };
	return saveEntity( input, noteSchema, saveNote );
}
