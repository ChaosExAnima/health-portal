import { cleanup, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mock as swrMock, clearResponse, setResponse } from '__mocks__/swr';
import { useProvidersForSelect } from './hooks';

import type { RecordsResponse, Response } from './api/types';
import type { Id, Provider, Slug } from './entities/types';

function TestFetchComponent< R extends Response >( {
	response,
}: {
	response?: R;
} ) {
	setResponse( response );
	const ProviderComponent = () => {
		const providerMap = useProvidersForSelect();
		return (
			<select>
				{ Array.from( providerMap.entries(), ( [ slug, name ] ) => (
					<option key={ slug } value={ slug }>
						{ name }
					</option>
				) ) }
			</select>
		);
	};

	return ProviderComponent();
}

describe( 'useProvidersForSelect', () => {
	afterEach( () => {
		clearResponse();
		cleanup();
	} );

	it( 'returns a map', async () => {
		let providers;
		const Component = () => {
			providers = useProvidersForSelect();
			return <>Test</>;
		};
		await render( <Component /> );
		expect( providers ).toBeInstanceOf( Map );
	} );

	it( 'calls the provider API', async () => {
		await render( <TestFetchComponent /> );
		expect( swrMock ).toHaveBeenCalled();
	} );

	it( 'returns a Map of provider slug: name', async () => {
		const response: RecordsResponse< Provider > = {
			success: true,
			records: [
				{
					slug: 'test' as Slug,
					name: 'Test Provider',
					address: null,
					phone: null,
					website: null,
					email: null,
					id: 1 as Id,
					created: '2022-01-01',
				},
			],
		};

		render( <TestFetchComponent response={ response } /> );
		await waitFor( () => screen.getByRole( 'combobox' ) );

		expect( screen.getAllByRole( 'option' ) ).toHaveLength( 1 );
		expect( screen.getByRole( 'combobox' ) ).toHaveTextContent(
			'Test Provider'
		);
		expect( screen.getByRole( 'combobox' ) ).toHaveValue( 'test' );
	} );

	it( 'returns an empty Map on API error', async () => {
		const response: RecordsResponse< Provider > = {
			success: false,
			errors: [],
		};

		render( <TestFetchComponent response={ response } /> );
		await waitFor( () => screen.getByRole( 'combobox' ) );

		expect( screen.queryAllByRole( 'option' ) ).toHaveLength( 0 );
	} );
} );
