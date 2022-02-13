import * as yup from 'yup';

import { capitalize } from 'lib/strings';
import { CONTENT_NOTE } from 'lib/constants';
import { dateToString } from './utils';
import rowToNote from './note';
import { rowToProvider } from './provider';

import type { ContentDB } from 'lib/db/types';
import type {
	Call,
	EntityAdditions,
	EntityWithAdditions,
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
		id,
		slug,
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

export type NewCallInput = Omit<
	Call,
	'id' | 'provider' | 'notes' | 'slug' | 'created'
> & {
	date: Date;
	provider: {
		id: number;
		name: string;
	};
	claims: number[];
};
export const callSchema: yup.ObjectSchema< NewCallInput > = yup
	.object( {
		date: yup.date().default( () => new Date() ),
		provider: yup
			.object( {
				id: yup.number().min( 0 ).required(),
				name: yup.string().trim().required(),
			} )
			.required(),
		reps: yup
			.array()
			.of( yup.string().required().trim().transform( capitalize ) )
			.ensure()
			.compact(),
		reason: yup.string().required(),
		reference: yup.string().trim(),
		result: yup.string().trim().required(),
		claims: yup.array( yup.number().required() ).ensure().required(),
	} )
	.required();
