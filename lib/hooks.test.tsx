import { act, cleanup, render } from '@testing-library/react';
import { Provider } from './entities/types';

import { useProvidersForSelect } from './hooks';

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
		global.fetch = jest.fn( () =>
			Promise.resolve( {
				json: () => Promise.resolve( { error: true } ),
			} )
		) as jest.Mock;

		const Component = () => {
			useProvidersForSelect();
			return <>Test</>;
		};
		await act( async () => render( <Component /> ) );

		expect( global.fetch ).toBeCalledWith( '/api/providers' );
	} );

	it( 'returns a Map of provider slug: name', async () => {
		const records: Provider[] = [
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
		];
		global.fetch = jest.fn( () =>
			Promise.resolve( {
				json: () => Promise.resolve( { success: true, records } ),
			} )
		) as jest.Mock;

		let providers;
		const Component = () => {
			providers = useProvidersForSelect();
			return <>Test</>;
		};
		await act( async () => render( <Component /> ) );

		expect( providers ).toEqual(
			new Map( records.map( ( { slug, name } ) => [ slug, name ] ) )
		);
	} );
} );
