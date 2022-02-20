import { errorToResponse, respondWithStatus } from 'lib/api/helpers';
import { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import { fromArray } from 'lib/casting';
import { getContentBySlug } from 'lib/db/helpers';
import { fileSchema } from 'lib/entities/schemas';
import { FileEntity } from 'lib/entities/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< FileEntity > | EntityUpdateResponse >
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
		const [
			{ saveEntity },
			{ fileSchema },
			{ saveFile },
		] = await Promise.all( [
			import( 'lib/api/entities' ),
			import( 'lib/entities/schemas' ),
			import( 'lib/entities/file' ),
		] );
		const input = { ...req.body, id: record.id };
		return respond( await saveEntity( input, fileSchema, saveFile ) );
	}
	respond( errorToResponse( 'Not implemented', 500 ) );
}
