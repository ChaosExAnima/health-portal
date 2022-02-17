import { cleanup, render } from '@testing-library/react';

import Detail from './detail';

describe( '<Detail>', () => {
	afterEach( cleanup );

	it( 'shows expected markup with children', () => {
		const { getByRole } = render( <Detail label="Label">Data</Detail> );
		expect( getByRole( 'term' ).textContent ).toBe( 'Label' );
		expect( getByRole( 'definition' ).textContent ).toBe( 'Data' );
	} );
	it( 'shows the default placeholder with no content', () => {
		const { getByRole } = render( <Detail label="Label"></Detail> );
		expect( getByRole( 'definition' ).textContent ).toBe( 'None' );
	} );
	it( 'shows custom placeholder with no content', () => {
		const { getByRole } = render(
			<Detail label="Label" placeholder="Nada! 😞"></Detail>
		);
		expect( getByRole( 'definition' ).textContent ).toBe( 'Nada! 😞' );
	} );
} );
