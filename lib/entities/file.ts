import { FileEntity, Id, Slug } from './types';
import { ContentDB } from 'lib/db/types';

export function rowToFile( row: ContentDB ): FileEntity {
	const { id, created, identifier: slug, info, status: source } = row;
	return {
		id: id as Id,
		created,
		slug: slug as Slug,
		url: String( info ),
		source,
	};
}
