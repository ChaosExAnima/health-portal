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
			'claim',
			fromArray( slug ) as string
		);
		if ( ! record ) {
			throw new NotFoundError();
		}
		if ( method === 'POST' ) {
			respond( await saveClaim( body, record.id ) );
		} else if ( method === 'GET' ) {
			const { rowToClaim } = await import( 'lib/entities/claim' );
			const response = {
				success: true,
				status: 200,
				record: rowToClaim( record ),
			};
			respond( response );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function saveClaim( body: any, id: number ) {
	const [
		{ saveEntity },
		{ claimSchema },
		{ saveClaim },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/schemas' ),
		import( 'lib/entities/claim' ),
	] );
	const input = { ...body, id };
	return saveEntity( input, claimSchema, saveClaim );
}
