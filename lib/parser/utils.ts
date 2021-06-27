import dayjs from 'dayjs';
import { createHash } from 'crypto';

import type Claim from 'lib/db/entities/claim';

type MaybeArray< T > = T | T[];

export function isClaimSame( newClaim: Claim, oldClaim?: Claim ): boolean {
	return (
		!! oldClaim &&
		newClaim.number === oldClaim.number &&
		newClaim.status === oldClaim.status &&
		dayjs( newClaim.serviceDate ).isSame( oldClaim.serviceDate ) &&
		newClaim.type === oldClaim.type &&
		newClaim.billed === oldClaim.billed &&
		newClaim.cost === oldClaim.cost
	);
}

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

export async function awaitMap< O >(
	inputArray: unknown[],
	callback: Promise<
		( value: unknown, index: number, array: unknown[] ) => O
	>
): Promise< O[] > {
	return Promise.all( inputArray.map( await callback ) );
}
