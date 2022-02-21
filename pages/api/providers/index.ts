import { queryEntities } from 'lib/api/entities';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';
import type {
	EntityUpdateResponse,
	RecordsResponse,
	WithStatus,
} from 'lib/api/types';
import type { Provider } from 'lib/entities/types';

type ProvidersResponse = RecordsResponse< Provider > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< ProvidersResponse >
) {
	const respond = respondWithStatus< ProvidersResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getProviders( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertProvider( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getProviders(
	query: any
): Promise< WithStatus< RecordsResponse< Provider > > > {
	const [ { queryAllProviders }, { rowToProvider } ] = await Promise.all( [
		import( 'lib/db/helpers' ),
		import( 'lib/entities/provider' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const providers = await queryAllProviders().limit( limit ).offset( offset );
	const records = providers.map( ( row ) => rowToProvider( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertProvider(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveProvider },
		{ providerSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/provider' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, providerSchema, saveProvider );
}
