import dayjs from 'dayjs';
import { ValidationError } from 'yup';

import {
	CONTENT_CALL,
	CONTENT_NOTE,
	TABLE_CONTENT,
	TABLE_PROVIDERS,
} from 'lib/constants';
import getDB from 'lib/db';
import { slugify } from 'lib/strings';
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

export async function saveCall( input: Call ): Promise< Slug > {
	const knex = getDB();
	let slug: Slug | null = null;
	await knex.transaction( async ( trx ) => {
		const { provider, created, reason, result } = input;
		let providerId = null;
		let providerName = null;
		if ( typeof provider === 'number' ) {
			providerId = provider;
			const providerRow = await trx( TABLE_PROVIDERS )
				.where( 'id', providerId )
				.first();
			if ( ! providerRow ) {
				throw new ValidationError(
					'Could not find provider',
					providerId,
					'provider'
				);
			}
			providerName = providerRow.name;
		} else if ( provider && 'name' in provider ) {
			[ providerId ] = await trx( TABLE_PROVIDERS ).insert( {
				slug: slugify( provider.name ),
				name: provider.name,
			} );
			providerName = provider.name;
		}

		if ( ! providerId || ! providerName ) {
			throw new Error( 'Could not get provider' );
		}

		slug = slugify(
			dayjs( created ).format( `YYYY-MM-DD [${ providerName }]` )
		);
		const [ id ] = await trx( TABLE_CONTENT ).insert( {
			type: CONTENT_CALL,
			created,
			identifier: slug,
			info: reason,
			status: result,
			providerId,
		} );

		if ( ! id ) {
			throw new Error( 'Could not save call' );
		}
	} );
	if ( ! slug ) {
		throw new Error( 'Slug never found' );
	}
	return slug;
}

export function rowToCall< A extends EntityAdditions >(
	row: ContentDB,
	additions: A = {} as A
): CallWithAdditions< A > {
	const { id, identifier: slug, info, status } = row;
	const call: Call = {
		id: id as Id,
		slug: slug as Slug,
		created: row.created,
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
