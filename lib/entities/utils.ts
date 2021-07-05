import { isObjectWithKeys } from 'lib/casting';
import { MetaDB } from 'lib/db/types';
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

export function isEntity( input: unknown ): input is Entity {
	return isObjectWithKeys( input, [ 'id', 'slug' ] );
}
