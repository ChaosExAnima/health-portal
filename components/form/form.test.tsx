import {
	act,
	cleanup,
	createEvent,
	fireEvent,
	render,
	screen,
} from '@testing-library/react';

import { formatErrors, handleNewType } from 'lib/api/new';
import Form from './form';

import type { AnyObjectSchema } from 'yup';
import type { FormProps } from './types';

jest.mock( 'lib/api/new', () => ( {
	formatErrors: jest.fn( ( arg0: any ) => arg0 ),
	handleNewType: jest.fn( () => null ),
} ) );

describe( '<Form>', () => {
	const mockHandleSubmit = jest.fn( ( form: any ) => ( event: Event ) => {
		event.preventDefault();
		form( 'test' );
	} );
	afterEach( () => {
		cleanup();
		( formatErrors as jest.Mock ).mockClear();
		( handleNewType as jest.Mock ).mockClear();
		mockHandleSubmit.mockClear();
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
		expect( handleNewType ).toBeCalledWith(
			'test',
			'appeal',
			expect.any( Function )
		);
	} );
	it( 'submit handler does not call insert when not new', () => {
		render( <Component /> );
		submit();
		expect( mockHandleSubmit ).toBeCalled();
		expect( handleNewType ).not.toBeCalled();
	} );
	it( 'calls transformation callback on submit', () => {
		const transform = jest.fn( () => 'test2' );
		render( <Component transform={ transform } new /> );

		submit();
		expect( transform ).toHaveBeenCalledTimes( 1 );
		expect( handleNewType ).toBeCalledWith(
			'test2',
			'appeal',
			expect.any( Function )
		);
	} );
	it( 'formats and displays errors', () => {
		let handleErrors: any;
		( handleNewType as jest.Mock ).mockImplementationOnce(
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
