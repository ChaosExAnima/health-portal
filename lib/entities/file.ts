import { File } from './types';
import { dateToString } from './utils';
import { ContentDB } from 'lib/db/types';

export function rowToFile( row: ContentDB ): File {
	const { id, identifier: slug, info: path } = row;
	return {
		id,
		slug,
		path,
		created: dateToString( row.created ),
	};
}
