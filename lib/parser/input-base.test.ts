import { Provider } from 'lib/db/entities';
import InputBase, { ClaimInsertData, RawClaim } from './input-base';

class InputGeneric extends InputBase< RawClaim > {
	public validate( input: RawClaim ): input is RawClaim {
		return true;
	}

	public convert( input: RawClaim ): ClaimInsertData {
		return input;
	}

	get( key: 'currentClaim' | 'providers' ) {
		return this[ key ];
	}
}

describe( 'InputBase', () => {
	const testClaim = { test: 'true' } as const;

	describe( 'process', () => {
		test( 'validates and converts the input', () => {
			const input = new InputGeneric();
			const validateFn = jest.spyOn( input, 'validate' );
			const convertFn = jest.spyOn( input, 'convert' );
			input.process( {} );
			expect( validateFn ).toHaveBeenCalledTimes( 1 );
			expect( convertFn ).toHaveBeenCalledTimes( 1 );
		} );
		test( 'assigns claim if validated', () => {
			const input = new InputGeneric();
			input.process( testClaim );
			expect( input.get( 'currentClaim' ) ).toEqual< typeof testClaim >(
				testClaim
			);
		} );
	} );

	describe( 'loadProviders', () => {
		test( 'loads providers', () => {
			const input = new InputGeneric();
			const testProvider = new Provider();
			input.loadProviders( [ testProvider ] );
			const providers = input.get( 'providers' ) as Provider[];
			expect( providers ).toHaveLength( 1 );
			expect( providers[ 0 ] ).toBe( testProvider );
		} );
	} );

	describe( 'getProviderOrThrow', () => {
		test( 'throws if claim not set', () => {
			const input = new InputGeneric();
			expect( input.getProviderOrThrow ).toThrow();
		} );
		test( 'throws if claim missing provider', () => {
			const input = new InputGeneric();
			input.process( testClaim );
			expect( input.getProviderOrThrow ).toThrow();
		} );
		test( 'throws if claim provider not found', () => {
			const input = new InputGeneric();
			input.process( { ...testClaim, provider: 'test' } );
			expect( input.getProviderOrThrow ).toThrow();
		} );
		test( 'returns claim provider via slug match', () => {
			const testProvider = new Provider();
			testProvider.id = 1;
			testProvider.slug = 'dr-test';
			const input = new InputGeneric( [ testProvider ] );
			input.process( { ...testClaim, provider: 'Dr. Test' } );
			expect( input.getProviderOrThrow() ).toEqual( testProvider );
		} );
	} );
} );
