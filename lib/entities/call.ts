import { isObjectWithKeys } from 'lib/casting';
import { CONTENT_CALL, CONTENT_NOTE } from 'lib/constants';
import { slugify } from 'lib/strings';

import { rowToNote } from './note';
import { ensureProvider, rowToProvider } from './provider';
import { dateToString, isEntity, saveContentEntity } from './utils';

import type {
	Call,
	CallInput,
	EntityAdditions,
	EntityWithAdditions,
	Id,
	Slug,
	WithMetaAdditions,
} from './types';
import type { Knex } from 'knex';
import type { ContentDB, DBMaybeInsert } from 'lib/db/types';

type CallWithAdditions< A extends EntityAdditions > = EntityWithAdditions<
	Call,
	A
> & {
	reps: A extends WithMetaAdditions< A > ? string[] : never;
};

export function isCall( input: unknown ): input is Call {
	return (
		isEntity( input ) &&
		isObjectWithKeys( input, [
			'name',
			'address',
			'phone',
			'email',
			'website',
		] )
	);
}

export async function callToRow(
	input: Call | CallInput,
	trx: Knex.Transaction
): Promise< DBMaybeInsert< ContentDB > > {
	let { id, created, reason, result } = input;
	const provider = await ensureProvider( input.provider, trx );
	let identifier = isEntity( input ) ? input.slug : undefined;
	if ( ! identifier ) {
		const { default: dayjs } = await import( 'dayjs' );
		identifier = slugify(
			dayjs( created ).format( 'YYYY-MM-DD' ) + ` [${ provider.name }]`
		);
	}
	return {
		id: id,
		type: CONTENT_CALL,
		created: new Date( created ),
		identifier,
		info: String( reason ),
		status: String( result ),
		providerId: provider.id,
	};
}

export function rowToCall< A extends EntityAdditions >(
	row: ContentDB,
	additions: A = {} as A
): CallWithAdditions< A > {
	const { id, identifier: slug, info, status } = row;
	const call: Call = {
		id: id as Id,
		slug: slug as Slug,
		created: dateToString( row.created ),
		reason: info ?? '',
		result: status,
	};
	const { provider, providers, relations, meta } = additions;
	if ( provider ) {
		call.provider = rowToProvider( provider );
	} else if ( providers ) {
		const providerRow = providers.find(
			( { id: providerId } ) => providerId === row.providerId
		);
		if ( providerRow ) {
			call.provider = rowToProvider( providerRow );
		}
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

export function saveCall( input: CallInput ) {
	return saveContentEntity( input, callToRow );
}
