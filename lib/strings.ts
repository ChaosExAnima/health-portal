import dayjs from 'dayjs';

import { toFloat } from './casting';
import * as constants from './constants';
import { Slug } from './entities/types';

export function capitalize( word: string ): string {
	word = word.trim();
	return (
		word.substring( 0, 1 ).toUpperCase() + word.substring( 1 ).toLowerCase()
	);
}

export function slugify( text: string ): Slug {
	return text
		.toLowerCase()
		.trim()
		.replace( /[^a-z0-9]/g, '-' )
		.replace( /-{2,}/g, '-' )
		.replace( /^-|-$/g, '' ) as Slug;
}

const formatter = new Intl.NumberFormat( 'en-US', {
	currency: 'USD',
	style: 'currency',
} );

export function formatCurrency( value: unknown ): string {
	const amount = toFloat( value );
	return formatter.format( amount );
}

export function formatDate( format: string ) {
	return ( input: Parameters< typeof dayjs >[ 0 ] ): string =>
		dayjs( input ).format( format );
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

export type ClaimType = typeof constants.CLAIM_TYPES[ number ];
export type ClaimStatus = typeof constants.CLAIM_STATUSES[ number ];

export function formatClaimType( type: ClaimType ): string {
	const types: Record< ClaimType, string > = {
		[ constants.CLAIM_TYPE_DENTAL ]: 'Dental',
		[ constants.CLAIM_TYPE_OUT ]: 'Out of Network',
		[ constants.CLAIM_TYPE_IN ]: 'In Network',
		[ constants.CLAIM_TYPE_MEDS ]: 'Pharmacy',
		[ constants.CLAIM_TYPE_OTHER ]: 'Other',
	} as const;
	return types[ type ] || 'Unknown';
}

export function formatClaimStatus( status: ClaimStatus ): string {
	const statuses: Record< ClaimStatus, string > = {
		[ constants.CLAIM_STATUS_SUBMITTED ]: 'Submitted',
		[ constants.CLAIM_STATUS_PENDING ]: 'Pending',
		[ constants.CLAIM_STATUS_APPEALING ]: 'Under Appeal',
		[ constants.CLAIM_STATUS_APPROVED ]: 'Approved',
		[ constants.CLAIM_STATUS_DENIED ]: 'Denied',
		[ constants.CLAIM_STATUS_DELETED ]: 'Deleted',
		[ constants.CLAIM_STATUS_UNKNOWN ]: 'Unknown',
	} as const;
	return statuses[ status ] || 'Unknown';
}
