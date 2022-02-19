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
		const { appealSchema } = await import( 'lib/entities/schemas' );
		const { saveAppeal } = await import( 'lib/entities/appeal' );
		const input = req.body;
		return respond( await insertEntity( input, appealSchema, saveAppeal ) );
	}
	return respond( errorToResponse( 'Not implemented', 500 ) );
}
