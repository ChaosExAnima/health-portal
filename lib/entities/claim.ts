import { rowToProvider } from './provider';
import {
	Claim,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	WithMetaAdditions,
} from './types';
import {
	dateToString,
	getNumericMeta,
	inReadonlyArray,
	relatedOfType,
} from './utils';
import * as constants from 'lib/constants';
import { ContentDB } from 'lib/db/types';
import { slugify } from 'lib/strings';
import rowToNote from './note';

type ClaimWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Claim,
	A
> & {
	billed: A extends WithMetaAdditions< A > ? number : never;
	cost: A extends WithMetaAdditions< A > ? number : never;
};

export default function rowToClaim< T extends EntityAdditions >(
	row: ContentDB,
	additions: T = {} as T
): ClaimWithAdditions< T > {
	const { meta, provider, relations } = additions;
	const { id, identifier: number, created: createdDate, info, status } = row;
	const created = dateToString( createdDate );
	const claim: Claim = {
		id: id as Id,
		number,
		slug: slugify( number ),
		date: created,
		status: inReadonlyArray(
			status,
			constants.CLAIM_STATUSES,
			constants.CLAIM_STATUS_UNKNOWN
		),
		created,
		type: inReadonlyArray(
			info,
			constants.CLAIM_TYPES,
			constants.CLAIM_TYPE_OTHER
		),
	};

	if ( provider ) {
		claim.provider = rowToProvider( provider );
	}

	const contentMeta = ( meta || [] ).filter(
		( { contentId } ) => contentId === id
	);
	if ( contentMeta.length ) {
		claim.billed = getNumericMeta( 'billed', contentMeta );
		claim.cost = getNumericMeta( 'cost', contentMeta );
	}

	if ( relations ) {
		const noteRows = relatedOfType( relations, 'note' );
		claim.notes = noteRows.map( rowToNote );
	}

	return claim as ClaimWithAdditions< T >;
}
