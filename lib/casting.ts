export function toInt( val: unknown ): number {
	if ( typeof val === 'number' ) {
		return Math.round( val );
	} else if ( typeof val === 'string' ) {
		return Number.parseInt( val, 10 );
	} else if ( typeof val === 'boolean' ) {
		return val ? 1 : 0;
	}

	return 0;
}

export function toString( val: unknown ): string {
	return val + '';
}
