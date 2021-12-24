import { SetRequired } from 'type-fest';

import rowToClaim from './claim';
import rowToImport from './import';
import rowToNote from './note';
import { Appeal } from './types';
import { dateToString, inReadonlyArray } from './utils';
import * as constants from 'lib/constants';
import { ContentDB, ImportDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

type AppealAdditions = {
	relations?: ContentDB[];
	import?: ImportDB;
};
type AppealWithRelations = SetRequired< AppealAdditions, 'relations' >;
type AppealWithImport = SetRequired< AppealAdditions, 'import' >;
type AppealWithAdditions< T > = T extends AppealWithRelations & AppealWithImport
	? SetRequired< Appeal, 'notes' | 'claims' | 'import' >
	: T extends AppealWithRelations
	? SetRequired< Appeal, 'notes' | 'claims' >
	: T extends AppealWithImport
	? SetRequired< Appeal, 'import' >
	: Appeal;

export const related = [
	constants.CONTENT_CLAIM,
	constants.CONTENT_NOTE,
] as const;
export type relatedType = typeof related[ number ];

export default function rowToAppeal< T extends AppealAdditions >(
	row: ContentDB,
	additions: T
): AppealWithAdditions< T > {
	const { relations, import: importObj } = additions;
	const { id, identifier: name, created: createdDate, status } = row;
	const created = dateToString( createdDate );
	const appeal: Appeal = {
		id,
		slug: slugify( name ),
		name,
		status: inReadonlyArray(
			status,
			constants.APPEAL_STATUSES,
			constants.APPEAL_STATUS_PENDING
		),
		created,
	};
	if ( relations ) {
		appeal.claims = [];
		appeal.notes = [];
		for ( const relation of relations ) {
			if ( relation.type === constants.CONTENT_CLAIM ) {
				appeal.claims.push( rowToClaim( relation, {} ) );
			} else if ( relation.type === constants.CONTENT_NOTE ) {
				appeal.notes.push( rowToNote( relation ) );
			}
		}
	}

	if ( importObj ) {
		appeal.import = rowToImport( importObj, {} );
	}
	return appeal as AppealWithAdditions< T >;
}
