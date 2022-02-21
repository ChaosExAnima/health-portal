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
import type { FileEntity } from 'lib/entities/types';

type FilesResponse = RecordsResponse< FileEntity > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< FilesResponse >
) {
	const respond = respondWithStatus< FilesResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getFiles( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertFile( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getFiles(
	query: any
): Promise< WithStatus< RecordsResponse< FileEntity > > > {
	const [ { queryFiles }, { rowToFile } ] = await Promise.all( [
		import( 'lib/db/helpers' ),
		import( 'lib/entities/file' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const files = await queryFiles().limit( limit ).offset( offset );
	const records = files.map( ( row ) => rowToFile( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertFile(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveFile },
		{ fileSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/file' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, fileSchema, saveFile );
}
