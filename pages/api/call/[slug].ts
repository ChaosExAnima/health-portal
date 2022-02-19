import {
	errorToResponse,
	respondWithStatus,
	saveEntity,
} from 'lib/api/helpers';
import { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';
import { saveCall } from 'lib/entities/call';
import { callSchema } from 'lib/entities/schemas';
import { Call } from 'lib/entities/types';

import type { NextApiRequest, NextApiResponse } from 'next';

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
		const input = { ...req.body, id: record.id };
		return respond( await saveEntity( input, callSchema, saveCall ) );
	}
	respond( errorToResponse( 'Not implemented', 500 ) );
}
