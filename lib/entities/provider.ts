import { omit } from 'lodash';
import { ValidationError } from 'yup';

import { isObjectWithKeys, isPlainObject } from 'lib/casting';
import { CONTENT_CLAIM, CONTENT_NOTE, TABLE_PROVIDERS } from 'lib/constants';
import { queryProvider } from 'lib/db/helpers';
import { slugify } from 'lib/strings';
import { rowToClaim } from './claim';
import rowToImport from './import';
import { rowToNote } from './note';
import { isEntity, relatedOfType } from './utils';

import type { Knex } from 'knex';
import type { SetRequired } from 'type-fest';
import type { ContentDB, ImportDB, ProviderDB } from 'lib/db/types';
import type { Claim, Import, Note, Provider, Id, Slug } from './types';

type ProviderAdditions = {
	relations?: ContentDB[];
	import?: ImportDB;
};
type ProviderWithAdditions< A extends ProviderAdditions > = Omit<
	Provider,
	'claims' | 'notes' | 'import'
> & {
	claims: A extends SetRequired< A, 'relations' > ? Claim[] : never;
	notes: A extends SetRequired< A, 'relations' > ? Note[] : never;
	import: A extends SetRequired< A, 'import' > ? Import : never;
};

export function isProvider( input: unknown ): input is Provider {
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

export async function ensureProvider(
	provider: unknown,
	trx: Knex.Transaction
): Promise< Provider > {
	let id: Id | undefined;
	if ( typeof provider === 'number' ) {
		id = provider as Id;
	} else if ( isPlainObject( provider ) && 'name' in provider ) {
		if ( isProvider( provider ) ) {
			return provider;
		}
		const { providerSchema } = await import( './schemas' );
		const validProvider = await providerSchema
			.omit( [ 'id' ] )
			.validate( provider );
		const [ providerId ] = await trx( TABLE_PROVIDERS ).insert( {
			slug: slugify( validProvider.name ),
			...validProvider,
		} );
		id = providerId as Id;
	}

	if ( ! id ) {
		throw new Error( 'Could not get provider id' );
	}
	const row = await queryProvider( id );
	if ( ! row ) {
		throw new ValidationError(
			'Could not find provider',
			provider,
			'provider'
		);
	}
	return rowToProvider( row );
}

export function rowToProvider< A extends ProviderAdditions >(
	row: ProviderDB,
	additions: A = {} as A
): ProviderWithAdditions< A > {
	const provider: Provider = {
		...omit( row, 'importId', 'slug', 'id' ),
		id: row.id as Id,
		slug: row.slug as Slug,
		created: row.created,
	};

	const { import: importObj, relations } = additions;
	if ( importObj ) {
		provider.import = rowToImport( importObj );
	}
	if ( relations ) {
		const claimRows = relatedOfType( relations, CONTENT_CLAIM );
		provider.claims = claimRows.map( ( claim ) => rowToClaim( claim ) );
		const noteRows = relatedOfType( relations, CONTENT_NOTE );
		provider.notes = noteRows.map( ( note ) => rowToNote( note ) );
	}
	return provider as ProviderWithAdditions< A >;
}
