import { errorToResponse, respondWithStatus } from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Claim } from 'lib/entities/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< Claim > | EntityUpdateResponse >
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
		const { saveEntity } = await import( 'lib/api/entities' );
		const { claimSchema } = await import( 'lib/entities/schemas' );
		const { saveClaim } = await import( 'lib/entities/claim' );
		const input = { ...req.body, id: record.id };
		return respond( await saveEntity( input, claimSchema, saveClaim ) );
	}
	respond( errorToResponse( 'Not implemented', 500 ) );
}
