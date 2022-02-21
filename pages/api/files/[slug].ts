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
			'file',
			fromArray( slug ) as string
		);
		if ( ! record ) {
			throw new NotFoundError();
		}
		if ( method === 'POST' ) {
			respond( await saveFile( body, record.id ) );
		} else if ( method === 'GET' ) {
			const { rowToFile } = await import( 'lib/entities/file' );
			const response = {
				success: true,
				status: 200,
				record: rowToFile( record ),
			};
			respond( response );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function saveFile( body: any, id: number ) {
	const [
		{ saveEntity },
		{ fileSchema },
		{ saveFile },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/schemas' ),
		import( 'lib/entities/file' ),
	] );
	const input = { ...body, id };
	return saveEntity( input, fileSchema, saveFile );
}
