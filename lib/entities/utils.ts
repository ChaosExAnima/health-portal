import { isObjectWithKeys } from 'lib/casting';
import { CONTENTS_TYPE } from 'lib/constants';
import { ContentDB, MetaDB } from 'lib/db/types';
import { Entity } from './types';

export function dateToString( date: Date ): string {
	return date.toUTCString();
}

export function getMeta( key: string, rows: MetaDB[] ): string | null {
	const meta = rows.find( ( row ) => row.key === key );
	if ( ! meta ) {
		return null;
	}
	return meta.value;
}

export function getNumericMeta( key: string, rows: MetaDB[] ): number | null {
	const value = getMeta( key, rows );
	return value ? Number.parseFloat( value ) : null;
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
