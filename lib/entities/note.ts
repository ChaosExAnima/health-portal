import { Note } from './types';
import { dateToString } from './utils';
import { ContentDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

export default function rowToNote( row: ContentDB ): Note {
	const { id, identifier, info: description, created: createdDate } = row;
	const created = dateToString( createdDate );
	return {
		id,
		slug: slugify( identifier ),
		description,
		created,
	};
}
