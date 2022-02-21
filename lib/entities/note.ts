import { Id, Note, NoteInput } from './types';
import { ContentDB, DBMaybeInsert } from 'lib/db/types';
import { slugify } from 'lib/strings';
import { isEntity, saveContentEntity } from './utils';
import { CONTENT_NOTE } from 'lib/constants';

export function isNote( input: unknown ): input is Note {
	return isEntity( input ) && 'description' in input;
}

export function rowToNote( row: ContentDB ): Note {
	const { id, identifier, created, info, status: due } = row;
	return {
		id: id as Id,
		slug: slugify( identifier ),
		created,
		description: String( info ),
		due: new Date( due ),
	};
}

export function noteToRow(
	input: Note | NoteInput
): DBMaybeInsert< ContentDB > {
	let created = new Date();
	if ( 'created' in input ) {
		created = input.created;
	}
	return {
		id: input.id,
		created,
		identifier: slugify( input.description ),
		info: input.description,
		status: input.due ? input.due.toISOString() : '',
		providerId: null,
		type: CONTENT_NOTE,
		importId: null,
	};
}

export function saveNote( input: NoteInput ) {
	return saveContentEntity( input, noteToRow );
}
