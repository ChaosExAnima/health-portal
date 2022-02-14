import '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { UseControllerReturn, useForm } from 'react-hook-form';
import { PartialDeep } from 'type-fest';

import AutocompleteField from '.';

jest.mock( 'react-hook-form', () => ( {
	...jest.requireActual( 'react-hook-form' ),
	useController: (): PartialDeep< UseControllerReturn > => ( {
		field: {
			value: '',
			onChange: () => null,
			ref: () => null,
		},
		fieldState: {},
		formState: {
			isSubmitting: false,
		},
	} ),
} ) );

describe( 'AutocompleteField', () => {
	it( 'shows the full label when not focused', () => {
		const Component = () => {
			const { control } = useForm();
			return (
				<AutocompleteField
					name="test"
					label="Test"
					control={ control }
				/>
			);
		};
		render( <Component /> );
		expect( screen.getByLabelText( 'Test' ) ).not.toBeFalsy();
	} );
} );
