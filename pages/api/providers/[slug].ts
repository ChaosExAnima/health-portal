import { NotFoundError } from 'lib/api/errors';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';
import { fromArray } from 'lib/casting';
import { queryProviderBySlug } from 'lib/db/helpers';

import type { EntityUpdateResponse, RecordResponse } from 'lib/api/types';
import type { Provider } from 'lib/entities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordResponse< Provider > | EntityUpdateResponse >
) {
	const {
		body,
		method,
		query: { slug },
	} = req;
	const respond = respondWithStatus( res );
	try {
		checkMethod( method );
		const record = await queryProviderBySlug( fromArray( slug ) as string );
		if ( ! record ) {
			throw new NotFoundError();
		}
		if ( method === 'POST' ) {
			respond( await saveProvider( body, record.id ) );
		} else if ( method === 'GET' ) {
			const { rowToProvider } = await import( 'lib/entities/provider' );
			const response = {
				success: true,
				status: 200,
				record: rowToProvider( record ),
			};
			respond( response );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function saveProvider( body: any, id: number ) {
	const [
		{ saveEntity },
		{ noteSchema },
		{ saveNote },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/schemas' ),
		import( 'lib/entities/note' ),
	] );
	const input = { ...body, id };
	return saveEntity( input, noteSchema, saveNote );
}
