import { MaybeArray, PlainObject } from 'global-types';
import { isPlainObject as isPlainObjectLodash, toNumber } from 'lodash';
import { Primitive } from 'type-fest';

export function toFloat( input: unknown ): number {
	const num = toNumber( input );
	if ( Number.isFinite( num ) ) {
		return num;
	}
	return 0;
}

export function isObjectWithKeys< Type = Record< string, Primitive > >(
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

export function toArray< T >( input: MaybeArray< T > ): T[] {
	return Array.isArray( input ) ? input : [ input ];
}

export function fromArray< T >( input: MaybeArray< T > ): T | undefined {
	return Array.isArray( input ) ? input[ 0 ] : input;
}

export function isPlainObject( input: any ): input is PlainObject {
	return isPlainObjectLodash( input );
}
