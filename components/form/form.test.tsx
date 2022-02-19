import {
	act,
	cleanup,
	createEvent,
	fireEvent,
	render,
	screen,
} from '@testing-library/react';

import { formatErrors, handleUpdateType } from 'lib/api/entities';
import Form from './form';

import type { AnyObjectSchema } from 'yup';
import type { BaseSyntheticEvent } from 'react';
import type { FormProps } from './types';

jest.mock( 'lib/api/entities', () => ( {
	formatErrors: jest.fn( ( arg0: any ) =>
		Array.isArray( arg0 ) ? arg0 : [ arg0 ]
	),
	handleUpdateType: jest.fn( () => null ),
} ) );

describe( '<Form>', () => {
	const mockHandleSubmit = jest.fn(
		( form: any ) => async ( event: BaseSyntheticEvent ) => {
			event.preventDefault();
			form( { test: true } );
		}
	);
	afterEach( () => {
		cleanup();
		jest.clearAllMocks();
	} );

	function Component( {
		type = 'appeal',
		children = 'test',
		...props
	}: Partial< FormProps< AnyObjectSchema > > = {} ): JSX.Element {
		return (
			<Form { ...{ type, ...props } } handleSubmit={ mockHandleSubmit }>
				{ children }
			</Form>
		);
	}

	function submit() {
		const button = screen.getByRole( 'button' );
		const event = createEvent.click( button );
		fireEvent( button, event );
		return event;
	}

	it( 'generates expected markup', () => {
		render( <Component /> );
		const form = screen.getByRole< HTMLFormElement >( 'form' );
		const button = screen.getByRole< HTMLButtonElement >( 'button' );
		expect( form ).toBeTruthy();
		expect( form.name ).toBe( 'appeal' );
		expect( button ).toBeTruthy();
		expect( button.textContent ).toBe( 'Submit' );
		expect( screen.queryByRole( 'alert' ) ).toBeFalsy();
	} );
	it( 'changes the name if new', () => {
		render( <Component new /> );
		const form = screen.getByRole< HTMLFormElement >( 'form' );
		expect( form.name ).toBe( 'new-appeal' );
	} );
	it( 'calls submit handler when submitted', () => {
		render( <Component /> );
		submit();
		expect( mockHandleSubmit ).toHaveBeenCalledWith(
			expect.any( Function )
		);
	} );
	it( 'submit handler calls insert function on new', () => {
		render( <Component new /> );
		submit();
		expect( mockHandleSubmit ).toBeCalled();
		expect( formatErrors ).not.toBeCalled();
		expect( handleUpdateType ).toBeCalledWith(
			{ test: true },
			'appeal',
			expect.any( Function ),
			undefined
		);
	} );
	it( 'submit handler updates with slug when not new', () => {
		mockHandleSubmit.mockImplementationOnce(
			( form: any ) => async ( event: BaseSyntheticEvent ) => {
				event.preventDefault();
				form( { test: true, slug: 'test' } );
			}
		);
		render( <Component /> );
		submit();
		expect( mockHandleSubmit ).toBeCalled();
		expect( formatErrors ).not.toBeCalled();
		expect( handleUpdateType ).toBeCalledWith(
			{ slug: 'test', test: true },
			'appeal',
			expect.any( Function ),
			'test'
		);
	} );
	it( 'submit handler displays an error when slug not provided', () => {
		render( <Component /> );
		submit();
		expect( mockHandleSubmit ).toBeCalled();
		expect( formatErrors ).toBeCalledWith( 'No slug provided' );
		expect( handleUpdateType ).not.toBeCalled();
	} );
	it( 'calls transformation callback on submit', () => {
		const transform = jest.fn( () => ( { test: 2 } ) );
		render( <Component transform={ transform } new /> );

		submit();
		expect( transform ).toHaveBeenCalledTimes( 1 );
		expect( formatErrors ).not.toBeCalled();
		expect( handleUpdateType ).toBeCalledWith(
			{ test: 2 },
			'appeal',
			expect.any( Function ),
			undefined
		);
	} );
	it( 'displays an error when form is not an object', () => {
		const transform = jest.fn( () => 'invalid' );
		render( <Component transform={ transform } /> );
		submit();
		expect( mockHandleSubmit ).toBeCalled();
		expect( transform ).toBeCalled();
		expect( formatErrors ).toBeCalledWith( 'Invalid submission' );
		expect( handleUpdateType ).not.toBeCalled();
	} );
	it( 'formats and displays errors', () => {
		let handleErrors: any;
		( handleUpdateType as jest.Mock ).mockImplementationOnce(
			( _form, _type, handler ) => ( handleErrors = handler )
		);
		render( <Component new /> );
		submit();
		expect( handleErrors ).toEqual( expect.any( Function ) );
		act( () => handleErrors( [ 'test' ] ) );
		expect( formatErrors ).toHaveBeenCalledWith( [ 'test' ] );
		expect( screen.getByRole( 'alert' ) ).toBeTruthy();
	} );
} );
