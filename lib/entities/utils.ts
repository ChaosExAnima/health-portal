import { isSafeInteger } from 'lodash';

import { isObjectWithKeys } from 'lib/casting';
import { CONTENTS_TYPE } from 'lib/constants';
import getDB from 'lib/db';
import { upsertContent } from 'lib/db/update';

import type {
	DateString,
	Entity,
	EntityInput,
	EntityToRowFunction,
	Id,
	Slug,
} from './types';
import type { ContentDB, MetaDB } from 'lib/db/types';

export function isValidId( id: number ): id is Id {
	return isSafeInteger( id ) && id > 0;
}

export function isSlug( slug: string ): slug is Slug {
	return !! slug;
}

export function dateToString( date?: Date ): DateString {
	return ( date || new Date() ).toJSON() as DateString;
}

export function getMeta( key: string, rows: MetaDB[] ): string | null {
	const meta = rows.find( ( row ) => row.key === key );
	if ( ! meta ) {
		return null;
	}
	return meta.value;
}

export function getNumericMeta(
	key: string,
	rows: MetaDB[]
): number | undefined {
	const value = getMeta( key, rows );
	return value ? Number.parseFloat( value ) : undefined;
}

export function relatedOfType< R extends ContentDB >(
	relations: R[],
	type: CONTENTS_TYPE
): R[] {
	return relations.filter(
		( { type: relationType } ) => type === relationType
	);
}

export function isEntity( input: unknown ): input is Entity {
	return isObjectWithKeys( input, [ 'id', 'slug' ] );
}

export function inReadonlyArray< T extends readonly string[] >(
	input: string,
	types: T
): T[ number ] | false;
export function inReadonlyArray< T extends readonly string[] >(
	input: string,
	types: T,
	fallback: T[ number ]
): T[ number ];
export function inReadonlyArray< T extends readonly string[] >(
	input: string,
	types: T,
	fallback?: T[ number ]
): T[ number ] | false {
	return types.includes( input ) ? input : fallback || false;
}

export async function saveContentEntity< Input extends EntityInput >(
	entity: Input,
	entityToRow: EntityToRowFunction< Input >
): Promise< Slug > {
	const knex = getDB();
	let slug: Slug | undefined;
	await knex.transaction( async ( trx ) => {
		const row = await entityToRow( entity, trx );
		const updatedRow = await upsertContent( row, trx );
		slug = updatedRow.identifier as Slug;
	} );
	if ( ! slug ) {
		throw new Error( 'Could not save call' );
	}
	return slug;
}
