import { Knex } from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';

import * as constants from 'lib/constants';
import {
	getIdColumn,
	queryAllProviders,
	queryContentType,
	queryRelatedProviders,
} from 'lib/db/helpers';
import { inReadonlyArray } from 'lib/entities/utils';

import type {
	AutocompleteOption,
	AutocompleteResponse,
} from 'components/form/types';
import type { ContentDB, ProviderDB } from 'lib/db/types';

type AutocompleteDB = ContentDB | ProviderDB;
type ProviderMap = Record< number, ProviderDB[ 'name' ] >;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< AutocompleteResponse >
) {
	const {
		query: { query, type },
	} = req;
	if ( Array.isArray( query ) || Array.isArray( type ) ) {
		return res.json( {
			success: false,
			errors: [ 'Invalid query or type' ],
		} );
	}

	if ( ! inReadonlyArray( type, constants.API_ENTITIES ) ) {
		return res.json( {
			success: false,
			errors: [ 'Invalid type' ],
		} );
	}
	const entityType: constants.API_ENTITY_TYPE = type as constants.API_ENTITY_TYPE;

	let dbQuery: Knex.QueryBuilder;
	if ( entityType === 'provider' ) {
		dbQuery = queryAllProviders().where( 'name', 'like', `%${ query }%` );
	} else {
		dbQuery = queryContentType( entityType ).where(
			'identifier',
			'like',
			`%${ query }%`
		);
	}
	const results: AutocompleteDB[] = await dbQuery.limit( 10 );
	const providers = await getCallProviders( results );

	res.json( {
		success: true,
		options: (
			await Promise.all(
				results.map( ( row ) => rowToOption( row, providers ) )
			)
		 ).filter( ( opt ): opt is AutocompleteOption => opt !== null ),
	} );
}

async function getCallProviders(
	rows: AutocompleteDB[]
): Promise< ProviderMap > {
	const calls: ContentDB[] = rows.filter(
		( row ): row is ContentDB =>
			'type' in row && row.type === constants.CONTENT_CALL
	);
	if ( ! calls.length ) {
		return {};
	}
	const providers = await queryRelatedProviders(
		getIdColumn( calls, 'providerId' )
	).select( 'id', 'name' );
	return Object.fromEntries(
		providers.map( ( { id, name } ) => [ id, name ] )
	);
}

async function rowToOption(
	row: AutocompleteDB,
	providers: ProviderMap
): Promise< AutocompleteOption | null > {
	let label: string;

	if ( 'name' in row ) {
		label = row.name;
	} else if ( row.type === constants.CONTENT_CALL ) {
		if ( row.providerId && Object.hasOwn( providers, row.providerId ) ) {
			label = `Call with ${ providers[ row.providerId ] }`;
		} else {
			return null;
		}
	} else {
		label = row.identifier;
	}

	return {
		id: row.id,
		label,
	};
}
