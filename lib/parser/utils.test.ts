import { getUniqueSlug } from './utils';

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
