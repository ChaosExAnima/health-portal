import { NextApiResponse } from 'next';
import { inspect } from 'util';
import { ValidationError } from 'yup';
import { StatusError } from './errors';
import { errorToResponse, respondWithStatus } from './helpers';

describe( 'API helpers', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'respondWithStatus()', () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		const respond = respondWithStatus(
			( res as unknown ) as NextApiResponse
		);
		it( 'returns a function that sets response and status', () => {
			expect( respond ).toEqual( expect.any( Function ) );
			respond( { status: 666, success: true } );
			expect( res.status ).toHaveBeenCalledWith( 666 );
			expect( res.json ).toHaveBeenCalledWith( { success: true } );
		} );
		it( 'throws a status error when status is not set or invalid', () => {
			expect( () =>
				respond( { status: -0, success: true } )
			).toThrowError( new StatusError( 'Tried to send invalid status' ) );
		} );
	} );

	describe( 'errorToResponse()', () => {
		const errorStates: [ any, string, number? ][] = [
			[ 'string error', 'string error' ],
			[ new ValidationError( 'error' ), 'error', 400 ],
			[
				new StatusError( 'error with status', 666 ),
				'error with status',
				666,
			],
			[ new Error( 'plain error' ), 'plain error' ],
		];
		for ( const [ err, message, status = 500 ] of errorStates ) {
			let prettyError = err;
			if ( err instanceof Error ) {
				prettyError = err.name;
			}
			test( `called with ${ prettyError } returns status ${ status }`, () => {
				expect( errorToResponse( err ) ).toEqual( {
					success: false,
					status,
					errors: [ message ],
				} );
			} );
		}
	} );
} );
