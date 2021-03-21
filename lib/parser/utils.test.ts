import { isClaimSame } from './utils';
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
