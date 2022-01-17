import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import '@testing-library/jest-dom';

import { useProvidersForSelect } from './hooks';

import type { ErrorResponse, RecordsResponse, Response } from './api/types';
import type { Provider } from './entities/types';

function TestFetchComponent< R extends Response >( {
	response,
}: {
	response?: R;
} ) {
	global.fetch = jest.fn( () =>
		Promise.resolve( {
			json: () =>
				Promise.resolve< R | ErrorResponse >(
					response || { success: false, errors: [] }
				),
		} )
	) as jest.Mock;

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

	return (
		<SWRConfig value={ { provider: () => new Map() } }>
			<ProviderComponent />
		</SWRConfig>
	);
}

describe( 'useProvidersForSelect', () => {
	afterEach( () => {
		if ( jest.isMockFunction( global.fetch ) ) {
			( global.fetch as jest.Mock ).mockRestore();
		}
		cleanup();
	} );

	it( 'returns a map', async () => {
		let providers;
		const Component = () => {
			providers = useProvidersForSelect();
			return <>Test</>;
		};
		await act( async () => render( <Component /> ) );
		expect( providers ).toBeInstanceOf( Map );
	} );

	it( 'calls the provider API', async () => {
		await act( async () => render( <TestFetchComponent /> ) );

		expect( global.fetch ).toBeCalledWith( '/api/providers' );
	} );

	it( 'returns a Map of provider slug: name', async () => {
		const response: RecordsResponse< Provider > = {
			success: true,
			records: [
				{
					slug: 'test',
					name: 'Test Provider',
					address: null,
					phone: null,
					website: null,
					email: null,
					id: 1,
					created: '2022-01-01',
				},
			],
		};

		render( <TestFetchComponent response={ response } /> );
		await waitFor( () => screen.getByRole( 'combobox' ) );

		expect( global.fetch ).toBeCalled();
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

		expect( global.fetch ).toBeCalled();
		expect( screen.queryAllByRole( 'option' ) ).toHaveLength( 0 );
	} );
} );
