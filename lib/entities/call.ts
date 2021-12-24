import { CONTENT_NOTE } from 'lib/constants';
import { dateToString } from './utils';
import rowToNote from './note';
import { rowToProvider } from './provider';

import type {
	Call,
	EntityAdditions,
	EntityWithAdditions,
	WithMetaAdditions,
} from './types';
import type { ContentDB } from 'lib/db/types';

type CallWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Call,
	A
> & {
	reps: A extends WithMetaAdditions< A > ? string[] : never;
};

export default function rowToCall< A extends EntityAdditions >(
	row: ContentDB,
	additions: A = {} as A
): CallWithAdditions< A > {
	const { id, identifier: slug } = row;
	const call: Call = {
		id,
		slug,
		created: dateToString( row.created ),
	};
	const { provider, relations, meta } = additions;
	if ( provider ) {
		call.provider = rowToProvider( provider );
	}
	if ( relations ) {
		call.notes = relations
			.filter( ( { type } ) => type === CONTENT_NOTE )
			.map( rowToNote );
	}
	if ( meta ) {
		call.reps = meta
			.filter( ( { key, value } ) => key === 'rep' && value )
			.map( ( { value } ) => value as string );
	}
	return call as CallWithAdditions< A >;
}
