import { File, Id, Slug } from './types';
import { dateToString } from './utils';
import { ContentDB } from 'lib/db/types';

export function rowToFile( row: ContentDB ): File {
	const { id, identifier: slug, info: path } = row;
	return {
		id: id as Id,
		slug: slug as Slug,
		path,
		created: dateToString( row.created ),
	};
}
