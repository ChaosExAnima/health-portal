import { omit } from 'lodash';

import { isObjectWithKeys } from 'lib/casting';
import { CONTENT_CLAIM, CONTENT_NOTE } from 'lib/constants';
import rowToClaim from './claim';
import rowToImport from './import';
import rowToNote from './note';
import { dateToString, isEntity, relatedOfType } from './utils';

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
