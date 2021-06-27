import InputAnthem, { AnthemClaim } from './input-anthem';

describe( 'InputAnthem', () => {
	const testInput = {
		'Claim Number': 'test number',
		Status: 'Approved',
		'Service Date': '2020-01-01',
		'Provided By': 'Dr. Test',
	} as const;

	describe( 'validate', () => {
		test( 'works with valid input', () => {
			const input = new InputAnthem();
			expect( input.validate( testInput ) ).toBeTruthy();
		} );
	} );
	describe( 'convert', () => {
		test( 'will convert with expected inputs', () => {
			const input = new InputAnthem();
			const inputObj: AnthemClaim = {
				...testInput,
				'Claim Type': '',
				Billed: '$1.23',
				'Your Cost': '$4.56',
			};
			expect( input.convert( inputObj ) ).toMatchObject( {
				number: 'test number',
				type: 'INNETWORK',
				serviceDate: new Date( Date.UTC( 2020, 0, 1 ) ),
				status: 'APPROVED',
				billed: 1.23,
				cost: 4.56,
			} );
			expect(
				input.convert( { ...inputObj, Status: 'Denied' } )
			).toMatchObject( {
				status: 'DENIED',
			} );
		} );
	} );
} );
