import '@testing-library/dom';
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { UseControllerReturn, useForm, useController } from 'react-hook-form';

import { useDebouncedSWR } from 'lib/hooks';
import AutocompleteField from './index';

import type { PartialDeep } from 'type-fest';
import type {
	AutocompleteOptions,
	AutocompleteResponse,
	FormAutocompleteFieldProps,
} from '../types';
import { SWRResponse } from 'swr';
import { setTimeout } from 'timers/promises';

jest.mock( 'react-hook-form', () => ( {
	...jest.requireActual( 'react-hook-form' ),
	useController: jest.fn(
		(): PartialDeep< UseControllerReturn > => ( {
			field: {
				value: '',
				onChange: () => null,
				ref: () => null,
			},
			fieldState: {},
			formState: {
				isSubmitting: false,
			},
		} )
	),
} ) );

jest.mock( 'lib/hooks', () => ( {
	useDebouncedSWR: jest.fn( () => ( { data: undefined, error: false } ) ),
} ) );

const mockController = useController as jest.MockedFunction<
	typeof useController
>;
const mockSWR = useDebouncedSWR as jest.MockedFunction<
	typeof useDebouncedSWR
>;

describe( 'AutocompleteField', () => {
	afterEach( () => {
		cleanup();
		jest.clearAllMocks();
	} );

	const Component = (
		props: Partial< FormAutocompleteFieldProps< any > >
	) => {
		const { control } = useForm();
		return (
			<AutocompleteField
				name="test"
				label="Test"
				{ ...props }
				control={ control }
			/>
		);
	};

	function mockApi( options?: AutocompleteOptions[] ) {
		mockSWR.mockImplementation(
			() =>
				( {
					data: { success: Array.isArray( options ), options },
					error: ! options,
				} as SWRResponse< AutocompleteResponse > )
		);
	}

	function search( value = 'search term' ) {
		const autocomplete = screen.getByRole( 'combobox' );
		autocomplete.focus();
		fireEvent.change( screen.getByRole( 'textbox' ), {
			target: { value },
		} );
	}

	it( 'shows the expected markup', () => {
		render( <Component /> );
		expect( screen.getByLabelText( 'Test' ) ).toBeTruthy();
		expect( screen.getByRole( 'textbox' ) ).toBeTruthy();
	} );

	it( 'calls SWR with paths', () => {
		render( <Component /> );
		expect( mockSWR ).toHaveBeenCalledWith( null );
		search();
		expect( mockSWR ).toHaveBeenCalledWith(
			'/api/search/test/search+term'
		);
		// expect( screen.queryByRole( 'presentation' )?.textContent ).toBe(
		// 	'Loading…'
		// );
	} );
	it.skip( 'shows results from API', async () => {
		mockApi( [ { id: 0, label: 'Test Option' } ] );
		render( <Component /> );
		search();
		await waitFor( () => screen.getByText( 'Test Option' ) );
	} );
} );
