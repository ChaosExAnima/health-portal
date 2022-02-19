import {
	errorToResponse,
	respondWithStatus,
	saveEntity,
} from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Appeal } from 'lib/entities/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< Appeal > | EntityUpdateResponse >
) {
	const {
		query: { slug },
	} = req;
	const record = await getContentBySlug(
		'appeal',
		fromArray( slug ) as string
	);
	const respond = respondWithStatus( res );
	if ( ! record ) {
		return respond( errorToResponse( 'Not found' ) );
	}
	if ( req.method === 'POST' ) {
		const { appealSchema } = await import( 'lib/entities/schemas' );
		const { saveAppeal } = await import( 'lib/entities/appeal' );
		const input = { ...req.body, id: record.id };
		return respond( await saveEntity( input, appealSchema, saveAppeal ) );
	}
	respond( errorToResponse( 'Not implemented', 500 ) );
}
