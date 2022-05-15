import mockKnex, { queryBuilder } from '__mocks__/knex';

import { queryProviderBySlug } from './helpers';

describe( 'queryProviderBySlug', () => {
	it( 'queries the provider by provided slug', async () => {
		await queryProviderBySlug( 'test' );
		expect( mockKnex ).toHaveBeenCalledTimes( 1 );
		expect( queryBuilder.where ).toHaveBeenCalledWith( 'slug', 'test' );
	} );
} );
