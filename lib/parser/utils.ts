import { createHash } from 'crypto';

type MaybeArray< T > = T | T[];

export function getHash(
	input: MaybeArray< Record< string, unknown > >,
	end?: number
): string {
	const hash = createHash( 'md5' );
	hash.update( JSON.stringify( input ) );
	const digest = hash.digest( 'hex' );
	return end ? digest.slice( 0, end ) : digest;
}

export function getUniqueSlug( parentSlug: string ): string {
	if ( ! parentSlug ) {
		throw new Error( 'No slug provided.' );
	}
	const matches = parentSlug.match( /^([a-z0-9-]+)-(\d+)$/i );
	if ( ! matches || matches.length !== 3 ) {
		return `${ parentSlug }-1`;
	}
	return `${ matches[ 1 ] }-${ Number.parseInt( matches[ 2 ] ) + 1 }`;
}
