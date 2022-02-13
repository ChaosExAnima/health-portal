import { CONTENT_NOTE } from 'lib/constants';
import { dateToString } from './utils';
import rowToNote from './note';
import { rowToProvider } from './provider';

import type { ContentDB } from 'lib/db/types';
import type {
	Call,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	Slug,
	WithMetaAdditions,
} from './types';

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
	const { id, identifier: slug, info, status } = row;
	const call: Call = {
		id: id as Id,
		slug: slug as Slug,
		created: dateToString( row.created ),
		reason: info,
		result: status,
	};
	const { provider, providers, relations, meta } = additions;
	if ( provider ) {
		call.provider = rowToProvider( provider );
	} else if ( providers ) {
		const providerRow = providers.find(
			( { id: providerId } ) => providerId === row.providerId
		);
		call.provider = providerRow ? rowToProvider( providerRow ) : undefined;
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
