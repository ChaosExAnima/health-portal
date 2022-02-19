import {
	errorToResponse,
	insertEntity,
	isInvalidMethod,
	respondWithStatus,
} from 'lib/api/helpers';
import { saveCall } from 'lib/entities/call';
import { callSchema } from 'lib/entities/schemas';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { EntitySuccessResponse } from 'lib/api/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< EntitySuccessResponse >
) {
	// Check methods.
	const respond = respondWithStatus( res );
	if ( isInvalidMethod( respond, req.method ) ) {
		return;
	}

	// Save new.
	if ( req.method === 'POST' ) {
		const input = req.body;
		return respond( await insertEntity( input, callSchema, saveCall ) );
	}
	return respond( errorToResponse( 'Not implemented', 500 ) );
}
