import router from 'next/router';
import { formatErrors, handleUpdateType, insertEntity } from './entities';

import type { Id, NewId, Slug } from 'lib/entities/types';
import type { AnyObjectSchema } from 'yup';

const json = jest.fn().mockReturnValue( { success: true, slug: 'test' } );
global.fetch = jest.fn().mockResolvedValue( { json } );

jest.mock( 'next/router', () => ( {
	default: jest.fn().mockReturnThis(),
	push: jest.fn(),
} ) );

describe( 'API Entities', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'handleUpdateType()', () => {
		const errorHandler = jest.fn();
		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: '{}',
		};
		test( 'fetches without slug from the api', async () => {
			await handleUpdateType( {}, 'appeal', errorHandler );
			expect( global.fetch ).toBeCalledWith(
				'/api/appeals',
				fetchOptions
			);
			expect( router.push ).toHaveBeenCalledWith( '/appeals/test' );
		} );
		test( 'fetches with slug from the api', async () => {
			await handleUpdateType(
				{},
				'appeal',
				errorHandler,
				'test2' as Slug
			);
			expect( global.fetch ).toBeCalledWith(
				'/api/appeals/test2',
				fetchOptions
			);
			expect( router.push ).toHaveBeenCalledWith( '/appeals/test' );
		} );
		test( 'calls error when body is not json', async () => {
			json.mockReturnValueOnce( null );
			await handleUpdateType( {}, 'appeal', errorHandler );
			expect( errorHandler ).toHaveBeenCalled();
			expect( router.push ).not.toHaveBeenCalled();
		} );
		test( 'calls error when body has errors', async () => {
			json.mockReturnValueOnce( {
				success: false,
				errors: [ 'test error!' ],
			} );
			await handleUpdateType( {}, 'appeal', errorHandler );
			expect( errorHandler ).toHaveBeenCalledWith( [ 'test error!' ] );
			expect( router.push ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'formatErrors()', () => {
		test( 'returns empty array if no errors', () => {
			expect( formatErrors() ).toEqual( [] );
		} );
		test( 'converts to arrays', () => {
			expect( formatErrors( 'error' ) ).toEqual( [ 'error' ] );
		} );
		test( 'gets text from error objects', () => {
			expect( formatErrors( { code: 'test', text: 'Test!' } ) ).toEqual( [
				'Test!',
			] );
		} );
	} );

	const schema = ( {
		omit: jest.fn().mockReturnThis(),
		validate: jest
			.fn()
			.mockImplementation( ( input ) => Promise.resolve( input ) ),
	} as unknown ) as AnyObjectSchema;
	const saveFunc = jest.fn().mockResolvedValue( 'test' );

	describe( 'insertEntity()', () => {
		test( 'throws when id is provided', () => {
			expect( () =>
				insertEntity( { id: 1 as Id }, schema, saveFunc )
			).rejects.toThrow();
			expect( schema.omit ).not.toHaveBeenCalled();
			expect( schema.validate ).not.toHaveBeenCalled();
			expect( saveFunc ).not.toHaveBeenCalled();
		} );
		test( 'works with id of zero', async () => {
			const input = { id: 0 as NewId };
			const result = await insertEntity( input, schema, saveFunc );
			expect( result ).toEqual( {
				success: true,
				status: 200,
				slug: 'test',
			} );
			expect( schema.omit ).toHaveBeenCalledWith( Object.keys( input ) );
			expect( schema.validate ).toHaveBeenCalledWith( input );
			expect( saveFunc ).toHaveBeenCalledWith( input );
		} );
	} );
} );
