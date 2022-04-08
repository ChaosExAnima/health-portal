import { isObjectWithKeys } from 'lib/casting';
import { FileEntity, FileInput, Id, Slug, WithMaybeNewId } from './types';
import { dateToString, isEntity, saveContentEntity } from './utils';

import type { ContentDB, DBMaybeInsert } from 'lib/db/types';
import { CONTENT_FILE } from 'lib/constants';
import { slugify } from 'lib/strings';

export function isFile( input: unknown ): input is FileEntity {
	return (
		isEntity( input ) &&
		isObjectWithKeys< FileEntity >( input, [ 'slug', 'source', 'url' ] )
	);
}

export function rowToFile( row: ContentDB ): FileEntity {
	const { id, created, identifier: slug, info, status: source } = row;
	return {
		id: id as Id,
		created: dateToString( created ),
		slug: slug as Slug,
		url: String( info ),
		source,
	};
}

export function fileToRow( input: FileEntity ): DBMaybeInsert< ContentDB > {
	return {
		id: input.id,
		created: new Date( input.created ),
		identifier: input.slug,
		type: CONTENT_FILE,
		info: input.url,
		status: input.source,
	};
}

export function saveFile( input: FileInput ) {
	let saveInput: FileEntity;
	if ( 'file' in input ) {
		// TODO: Handle file uploads
		// eslint-disable-next-line no-console
		console.warn( 'Trying to upload file:', input.file );
		saveInput = {
			created: dateToString(),
			slug: slugify( input.file.name ),
			url: '',
			source: '',
		};
	} else {
		saveInput = {
			...input,
		};
	}
	return saveContentEntity( saveInput, fileToRow );
}
