import {
	errorToResponse,
	respondWithStatus,
	saveEntity,
} from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Call } from 'lib/entities/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< Call > | EntityUpdateResponse >
) {
	const {
		query: { slug },
	} = req;
	const record = await getContentBySlug(
		'call',
		fromArray( slug ) as string
	);
	const respond = respondWithStatus( res );
	if ( ! record ) {
		return respond( errorToResponse( 'Not found' ) );
	}
	if ( req.method === 'POST' ) {
		const { callSchema } = await import( 'lib/entities/schemas' );
		const { saveCall } = await import( 'lib/entities/call' );
		const input = { ...req.body, id: record.id };
		return respond( await saveEntity( input, callSchema, saveCall ) );
	}
	respond( errorToResponse( 'Not implemented' ) );
}
