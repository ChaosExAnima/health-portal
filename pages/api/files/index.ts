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
		const [
			{ insertEntity },
			{ fileSchema },
			{ saveFile },
		] = await Promise.all( [
			import( 'lib/api/entities' ),
			import( 'lib/entities/schemas' ),
			import( 'lib/entities/file' ),
		] );
		const input = req.body;
		return respond( await insertEntity( input, fileSchema, saveFile ) );
	}
	return respond( errorToResponse( 'Not implemented', 500 ) );
}
