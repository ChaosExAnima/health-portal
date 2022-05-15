import { isDate } from 'lodash';

import { CONTENT_NOTE } from 'lib/constants';
import { ContentDB, DBMaybeInsert } from 'lib/db/types';
import { slugify } from 'lib/strings';

import { Id, Note, NoteInput } from './types';
import { dateToString, isEntity, saveContentEntity } from './utils';

export function isNote( input: unknown ): input is Note {
	return isEntity( input ) && 'description' in input;
}

export function rowToNote( row: ContentDB ): Note {
	const { id, identifier, created, info, status: due } = row;
	return {
		id: id as Id,
		slug: slugify( identifier ),
		created: dateToString( created ),
		description: String( info ),
		due: dateToString( new Date( due ) ),
	};
}

export function noteToRow(
	input: Note | NoteInput
): DBMaybeInsert< ContentDB > {
	let created = new Date();
	if ( 'created' in input ) {
		created = new Date( input.created );
	}
	return {
		id: input.id,
		created,
		identifier: slugify( input.description ),
		info: input.description,
		status: isDate( input.due )
			? dateToString( input.due )
			: input.due || '',
		type: CONTENT_NOTE,
	};
}

export function saveNote( input: NoteInput ) {
	return saveContentEntity( input, noteToRow );
}
