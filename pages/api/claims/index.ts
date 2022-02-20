import {
	errorToResponse,
	isInvalidMethod,
	respondWithStatus,
} from 'lib/api/helpers';

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
		const { insertEntity } = await import( 'lib/api/entities' );
		const { claimSchema } = await import( 'lib/entities/schemas' );
		const { saveClaim } = await import( 'lib/entities/claim' );
		const input = req.body;
		return respond( await insertEntity( input, claimSchema, saveClaim ) );
	}
	return respond( errorToResponse( 'Not implemented', 500 ) );
}
