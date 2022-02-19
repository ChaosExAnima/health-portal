import { Id, Note } from './types';
import { ContentDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

export default function rowToNote( row: ContentDB ): Note {
	const { id, identifier, created, info, status: due } = row;
	return {
		id: id as Id,
		slug: slugify( identifier ),
		created,
		description: String( info ),
		due: new Date( due ),
	};
}
