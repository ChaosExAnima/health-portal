import { SetRequired } from 'type-fest';

import { rowToFile } from './file';
import { Id, Import } from './types';
import { dateToString } from './utils';
import { ContentDB, ImportDB } from 'lib/db/types';

type ImportAdditions = {
	file?: ContentDB;
};
type ImportWithFile = SetRequired< ImportAdditions, 'file' >;
type ImportWithAdditions< T > = T extends ImportWithFile
	? SetRequired< Import, 'file' >
	: Import;

export default function rowToImport< T extends ImportAdditions >(
	row: ImportDB,
	additions: T = {} as T
): ImportWithAdditions< T > {
	const { id, hash, inserted, updated } = row;
	const importObj: Import = {
		id: id as Id,
		hash,
		inserted,
		updated,
		created: dateToString( row.created ),
	};
	if ( additions.file ) {
		importObj.file = rowToFile( additions.file );
	}
	return importObj as ImportWithAdditions< T >;
}
