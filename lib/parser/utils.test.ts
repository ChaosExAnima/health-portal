import { getUniqueSlug, isClaimSame } from './utils';
import { baseClaim } from './test-utils';
import Claim from 'lib/db/entities/claim';

describe( 'isClaimSame', () => {
	test( 'returns true on identical claims', () => {
		const claim1 = new Claim( baseClaim );
		const claim2 = new Claim( baseClaim );
		expect( isClaimSame( claim1, claim2 ) ).toBeTruthy();
	} );

	function getDiffOnKey(
		claimKey: keyof typeof baseClaim
	): string | Date | number {
		switch ( typeof baseClaim[ claimKey ] ) {
			case 'string':
				return 'changed';
			case 'object':
				return new Date( 2000, 1 );
			case 'number':
				return 4.56;
			default:
				throw new Error(
					'Unknown type: ' + typeof baseClaim[ claimKey ]
				);
		}
	}

	test( 'returns false on claim with different keys', () => {
		Object.keys( baseClaim )
			.filter( ( claimKey ) => ! [ 'slug' ].includes( claimKey ) )
			.forEach( ( claimKey: keyof typeof baseClaim ) => {
				const claim1 = new Claim( { ...baseClaim } );
				const claim2 = new Claim( {
					...baseClaim,
					[ claimKey ]: getDiffOnKey( claimKey ),
				} );
				expect( isClaimSame( claim1, claim2 ) ).toBeFalsy();
			} );
	} );
} );

describe( 'getHash', () => {
	test.todo( 'gets correct hash for empty array' );
	test.todo( 'gets correct hash with dummy data' );
	test.todo( 'returns length from second arg' );
} );

describe( 'getUniqueSlug', () => {
	test( 'throws when empty string', () => {
		expect( () => getUniqueSlug( '' ) ).toThrow();
	} );
	test( 'appends 1 when passed slug with no suffix', () => {
		expect( getUniqueSlug( 'test' ) ).toEqual( 'test-1' );
	} );
	test( 'increments suffix when provided one', () => {
		expect( getUniqueSlug( 'test-1' ) ).toEqual( 'test-2' );
	} );
	test( 'handles multiple digits okay', () => {
		expect( getUniqueSlug( 'test-249' ) ).toEqual( 'test-250' );
	} );
	test( 'handles numbers okay', () => {
		expect( getUniqueSlug( '12345-6' ) ).toEqual( '12345-7' );
	} );
	test( 'handles invalid patterns okay', () => {
		expect( getUniqueSlug( '%#@#*!' ) ).toEqual( '%#@#*!-1' );
	} );
} );
