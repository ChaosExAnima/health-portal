import { isPlainObject, toNumber } from 'lodash';
import { Primitive } from 'type-fest';

export function toFloat( input: unknown ): number {
	const num = toNumber( input );
	if ( Number.isFinite( num ) ) {
		return num;
	}
	return 0;
}

export function isObjectWithKeys< Type extends Record< string, Primitive > >(
	input: unknown,
	keys: Extract< keyof Type, string >[]
): input is Type {
	return (
		isPlainObject( input ) &&
		keys.every( ( key ) =>
			( input as Record< string, unknown > ).hasOwnProperty( key )
		)
	);
}

export function toArray< T >( input: T | T[] ): T[] {
	return Array.isArray( input ) ? input : [ input ];
}
