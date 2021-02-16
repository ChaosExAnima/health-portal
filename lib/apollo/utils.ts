export function removeNull< TValue >(
	value: TValue | null | undefined
): value is TValue {
	return value !== null && value !== undefined;
}

export function slugToPath(
	link: { __typename?: string; slug?: string | null } | undefined | null
): string | null {
	return ( link && typeToPath( link.__typename, link.slug ) ) || null;
}

export function typeToPath( type?: string, slug?: string | null ): string {
	switch ( type ) {
		case 'Call':
			return `/calls/${ slug }`;
		case 'Claim':
			return `/claims/${ slug }`;
		case 'Appeal':
			return `/appeals/${ slug }`;
		case 'Provider':
			return `/providers/${ slug }`;
		default:
			return '';
	}
}

export function removeNulls(
	input: Record< string, null | unknown >
): Record< string, unknown > {
	const output: Record< string, unknown > = {};
	for ( const key in input ) {
		output[ key ] = input[ key ] === null ? undefined : input[ key ];
	}
	return output;
}
