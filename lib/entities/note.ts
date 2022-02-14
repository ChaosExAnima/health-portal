import { Id, Note } from './types';
import { ContentDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

export default function rowToNote( row: ContentDB ): Note {
	const { id, identifier, created, info: description, status: due } = row;
	return {
		id: id as Id,
		slug: slugify( identifier ),
		created,
		description,
		due: new Date( due ),
	};
}
