import {
	capitalize,
	formatClaimStatus,
	formatClaimType,
	priceToNumber,
	slugify,
} from './strings';
import * as constants from 'lib/constants';

describe( 'capitalize', () => {
	test( 'Capitalizes words', () => {
		expect( capitalize( 'test' ) ).toEqual( 'Test' );
	} );
	test( 'Handles numbers', () => {
		expect( capitalize( '1test' ) ).toEqual( '1test' );
	} );
	test( 'Trims text', () => {
		expect( capitalize( 'test ' ) ).toEqual( 'Test' );
	} );
	test( 'Handles multiple words', () => {
		expect( capitalize( 'test words' ) ).toEqual( 'Test words' );
	} );
} );

describe( 'slugify', () => {
	test( 'Returns nothing for invalid characters', () => {
		expect( slugify( '$@$^#^*;<>./' ) ).toEqual( '' );
	} );
	test( 'Handles capitals', () => {
		expect( slugify( 'TEST' ) ).toEqual( 'test' );
	} );
	test( 'Swaps non-alphanumeric chars for single dashes', () => {
		expect( slugify( '__TEST SLUG 1__' ) ).toEqual( 'test-slug-1' );
	} );
	test( 'Strips dashes from ends', () => {
		expect( slugify( '-test-' ) ).toEqual( 'test' );
	} );
} );

describe( 'priceToNumber', () => {
	test( 'returns null on falsey vaues', () => {
		expect( priceToNumber() ).toEqual( null );
	} );
	test( 'returns null on empty string', () => {
		expect( priceToNumber( '' ) ).toEqual( null );
	} );
	test( 'returns null on invalid string', () => {
		expect( priceToNumber( 'invalid!' ) ).toEqual( null );
	} );
	test( 'returns null on multiple dots', () => {
		expect( priceToNumber( '12.3.4' ) ).toEqual( null );
	} );
	test( 'returns float when provided price', () => {
		expect( priceToNumber( '$1.23' ) ).toEqual( 1.23 );
	} );
	test( 'strips invalid chars', () => {
		expect( priceToNumber( ' \n$\t1.\t23!!' ) ).toEqual( 1.23 );
	} );
} );

describe( 'claimType', () => {
	test( 'Parses types', () => {
		const typeMap = {
			[ constants.CLAIM_TYPE_DENTAL ]: 'Dental',
			[ constants.CLAIM_TYPE_OUT ]: 'Out of Network',
			[ constants.CLAIM_TYPE_IN ]: 'In Network',
			[ constants.CLAIM_TYPE_MEDS ]: 'Pharmacy',
			[ constants.CLAIM_TYPE_OTHER ]: 'Other',
		};
		for ( const [ input, output ] of Object.entries( typeMap ) ) {
			expect(
				formatClaimType( input as constants.CLAIM_TYPES_TYPE )
			).toEqual( output );
		}
	} );
} );

describe( 'claimStatus', () => {
	test( 'Parses statuses', () => {
		const typeMap = {
			[ constants.CLAIM_STATUS_PENDING ]: 'Pending',
			[ constants.CLAIM_STATUS_APPROVED ]: 'Approved',
			[ constants.CLAIM_STATUS_DENIED ]: 'Denied',
			[ constants.CLAIM_STATUS_DELETED ]: 'Deleted',
			[ constants.CLAIM_STATUS_UNKNOWN ]: 'Unknown',
		};
		for ( const [ input, output ] of Object.entries( typeMap ) ) {
			expect(
				formatClaimStatus( input as constants.CLAIM_STATUS_TYPE )
			).toEqual( output );
		}
	} );
} );
