import '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import AutocompleteField from '.';

jest.mock( 'react-hook-form', () => ( {
	...jest.requireActual( 'react-hook-form' ),
	useController: () => ( {
		field: { value: '', onChange: () => null, ref: () => null },
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
