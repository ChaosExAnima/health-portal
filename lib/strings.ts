export function capitalize( word: string ): string {
	word = word.trim();
	return word.substr( 0, 1 ).toUpperCase() + word.substr( 1 ).toLowerCase();
}

export function slugify( text: string ): string {
	return text
		.toLowerCase()
		.trim()
		.replace( /[^a-z0-9]/g, '-' )
		.replace( /-{2,}/g, '-' )
		.replace( /^-|-$/g, '' );
}

export function priceToNumber( price?: string ): number | null {
	if ( ! price || ( price.match( /\./g ) || [] ).length > 1 ) {
		return null;
	}
	const parsedPrice = Number.parseFloat( price.replace( /[^\d\.]*/g, '' ) );
	if ( Number.isNaN( parsedPrice ) ) {
		return null;
	}
	return parsedPrice;
}

export function formatClaimType( type: string ): string {
	const types: Record< string, string > = {
		DENTAL: 'Dental',
		OUTOFNETWORK: 'Out of Network',
		INNETWORK: 'In Network',
		PHARMACY: 'Pharmacy',
	} as const;
	return types[ type ] || 'Unknown';
}

export function formatClaimStatus( status: string ): string {
	const statuses: Record< string, string > = {
		PENDING: 'Pending',
		APPROVED: 'Approved',
		DENIED: 'Denied',
		DELETED: 'Deleted',
	} as const;
	return statuses[ status ] || 'Unknown';
}
