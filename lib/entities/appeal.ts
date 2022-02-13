import rowToClaim from './claim';
import rowToNote from './note';
import { dateToString, inReadonlyArray } from './utils';
import * as constants from 'lib/constants';
import { slugify } from 'lib/strings';

import type {
	Appeal,
	Claim,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	WithRelationAdditions,
} from './types';
import type { ContentDB } from 'lib/db/types';

type AppealWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Appeal,
	A
> & {
	claims: A extends WithRelationAdditions< A > ? Claim[] : never;
};

export const related = [
	constants.CONTENT_CLAIM,
	constants.CONTENT_NOTE,
] as const;
export type relatedType = typeof related[ number ];

export default function rowToAppeal< A extends EntityAdditions >(
	row: ContentDB,
	additions: A = {} as A
): AppealWithAdditions< A > {
	const { relations } = additions;
	const { id, identifier: name, created: createdDate, status } = row;
	const created = dateToString( createdDate );
	const appeal: Appeal = {
		id: id as Id,
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

	return appeal as AppealWithAdditions< A >;
}
