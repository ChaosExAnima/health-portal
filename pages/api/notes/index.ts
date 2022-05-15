import { queryEntities } from 'lib/api/entities';
import {
	checkMethod,
	errorToResponse,
	respondWithStatus,
} from 'lib/api/helpers';

import type {
	EntityUpdateResponse,
	RecordsResponse,
	WithStatus,
} from 'lib/api/types';
import type { Note } from 'lib/entities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type NotesResponse = RecordsResponse< Note > | EntityUpdateResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< NotesResponse >
) {
	const respond = respondWithStatus< NotesResponse >( res );
	const { method, query, body } = req;
	try {
		checkMethod( method );
		if ( method === 'GET' ) {
			respond( await getNotes( query ) );
		} else if ( method === 'POST' ) {
			respond( await insertNote( body ) );
		}
	} catch ( err ) {
		respond( errorToResponse( err ) );
	}
}

async function getNotes(
	query: any
): Promise< WithStatus< RecordsResponse< Note > > > {
	const [ { queryNotes }, { rowToNote } ] = await Promise.all( [
		import( 'lib/db/helpers' ),
		import( 'lib/entities/note' ),
	] );
	const { offset, limit } = await queryEntities( query );
	const notes = await queryNotes().limit( limit ).offset( offset );
	const records = notes.map( ( row ) => rowToNote( row ) );
	return {
		success: true,
		status: 200,
		records,
	};
}

async function insertNote(
	body: any
): Promise< WithStatus< EntityUpdateResponse > > {
	const [
		{ insertEntity },
		{ saveNote },
		{ noteSchema },
	] = await Promise.all( [
		import( 'lib/api/entities' ),
		import( 'lib/entities/note' ),
		import( 'lib/entities/schemas' ),
	] );
	return await insertEntity( body, noteSchema, saveNote );
}
