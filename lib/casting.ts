import { DeepReplace, MaybeArray, PlainObject, Timestamp } from 'global-types';
import {
	isDate,
	isPlainObject as isPlainObjectLodash,
	isSafeInteger,
	toNumber,
} from 'lodash';
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

export function entityDateToTS< T >( object: T ) {
	if ( ! isPlainObject( object ) ) {
		return object;
	}

	const tsObject: Record< string, any > = {};
	for ( const key in object ) {
		const value = object[ key ];
		tsObject[ key ] = isDate( value ) ? dateToTS( value ) : value;
	}
	return tsObject as DeepReplace< T, Date, Timestamp >;
}

export function entityTStoDate( object: unknown ) {
	if ( ! isPlainObject( object ) ) {
		return object;
	}
	for ( const key in object ) {
		const value = object[ key ];
		object[ key ] = isTimestamp( value ) ? TStoDate( value ) : value;
	}
	return object;
}

export function isTimestamp( input: any ): input is Timestamp {
	return typeof input === 'string' && /^ts:\d+$/.test( input );
}

export function dateToTS( input: Date ): Timestamp {
	if ( ! isDate( input ) ) {
		return input;
	}
	return `ts:${ input.getTime() }` as Timestamp;
}

export function TStoDate( input: Timestamp ): Date {
	if ( ! isTimestamp( input ) ) {
		return input;
	}
	return new Date( Number.parseInt( input.substring( 3 ), 10 ) );
}
