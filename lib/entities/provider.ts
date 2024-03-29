import { omit } from 'lodash';
import { ValidationError } from 'yup';

import { isObjectWithKeys, isPlainObject } from 'lib/casting';
import { CONTENT_CLAIM, CONTENT_NOTE, TABLE_PROVIDERS } from 'lib/constants';
import { queryProvider } from 'lib/db/helpers';
import { slugify } from 'lib/strings';

import { rowToClaim } from './claim';
import rowToImport from './import';
import { rowToNote } from './note';
import { dateToString, isEntity, relatedOfType } from './utils';

import type {
	Claim,
	Import,
	Note,
	Provider,
	Id,
	Slug,
	ProviderInput,
	WithImport,
} from './types';
import type { Knex } from 'knex';
import type {
	ContentDB,
	DBMaybeInsert,
	ImportDB,
	ProviderDB,
} from 'lib/db/types';
import type { SetRequired } from 'type-fest';

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
	} else if (
		isPlainObject( provider ) &&
		'id' in provider &&
		provider.id > 0
	) {
		id = provider.id;
	} else if ( isPlainObject( provider ) && 'name' in provider ) {
		if ( isProvider( provider ) ) {
			return provider;
		}
		const { providerSchema } = await import( './schemas' );
		const validProvider = await providerSchema
			.omit( [ 'id', 'slug' ] )
			.validate( provider );
		const created = new Date();
		const [ providerId ] = await trx( TABLE_PROVIDERS ).insert( {
			slug: slugify( validProvider.name ),
			created,
			...validProvider,
		} );
		return {
			id: providerId as Id,
			slug: slugify( validProvider.name ),
			created: dateToString( created ),
			...validProvider,
		};
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
		created: dateToString( row.created ),
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

export function providerToRow(
	entity: ( ProviderInput & WithImport ) | Provider
): DBMaybeInsert< ProviderDB > {
	const { slug, import: importField, ...fields } = entity;
	return {
		...fields,
		created: new Date(),
		slug: slug ?? slugify( entity.name ),
		importId: importField?.id,
	};
}

export async function saveProvider( input: ProviderInput ) {
	const [ { default: getDB }, { upsertProvider } ] = await Promise.all( [
		import( 'lib/db' ),
		import( 'lib/db/update' ),
	] );
	const knex = getDB();
	let slug: Slug | undefined;
	await knex.transaction( async ( trx ) => {
		const row = await providerToRow( input );
		const updatedRow = await upsertProvider( row, trx );
		slug = updatedRow.slug as Slug;
	} );
	if ( ! slug ) {
		throw new Error( 'Could not save call' );
	}
	return slug;
}
