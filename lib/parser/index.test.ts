import { createConnection, EntityManager, getConnection } from 'typeorm';
import { getAndInsertProviders } from './index';

import * as entities from 'lib/db/entities';
import type Import from 'lib/db/entities/import';
import type Provider from 'lib/db/entities/provider';

function getEntityManager(): EntityManager {
	return getConnection( 'test' ).createEntityManager();
}

async function getImportEntity( em: EntityManager ): Promise< Import > {
	const importRepo = em.getRepository< Import >( 'Import' );
	return importRepo.save( {
		hash: 'test1234',
	} );
}

beforeEach( () => {
	return createConnection( {
		name: 'test',
		type: 'sqlite',
		database: ':memory:',
		dropSchema: true,
		entities: [
			...( ( Object.values( entities ) as unknown[] ) as string[] ),
		],
		synchronize: true,
		logging: false,
	} );
} );

afterEach( () => {
	const conn = getConnection( 'test' );
	return conn.close();
} );

describe( 'getAndInsertProviders', () => {
	test( 'will return providers', async () => {
		const em = getEntityManager();
		const importEntity = await getImportEntity( em );
		const rawClaims = [
			{
				'Claim Received': 'yes',
				'Provided By': 'Dr. Test',
			},
		];
		const providers = await getAndInsertProviders(
			rawClaims,
			em,
			importEntity
		);
		expect( providers ).toHaveLength( 1 );
	} );

	test( 'will not create duplicates', async () => {
		const em = getEntityManager();
		const importEntity = await getImportEntity( em );
		const rawClaims = [
			{
				'Claim Received': 'yes',
				'Provided By': 'Dr. Test',
			},
			{
				'Claim Received': 'yes',
				'Provided By': 'Dr. Test',
			},
		];
		const providers = await getAndInsertProviders(
			rawClaims,
			em,
			importEntity
		);
		expect( providers ).toHaveLength( 1 );
	} );

	test( 'will not overwrite', async () => {
		const em = getEntityManager();
		const importEntity = await getImportEntity( em );
		const rawClaims = [
			{
				'Claim Received': 'yes',
				'Provided By': 'Dr. Test',
			},
		];
		const providerRepo = em.getRepository< Provider >( 'Provider' );
		await providerRepo.save( { slug: 'dr-test', name: 'Dr. Test' } );
		const providers = await getAndInsertProviders(
			rawClaims,
			em,
			importEntity
		);
		expect( providers ).toHaveLength( 1 );
	} );

	test( 'will attach import', async () => {
		const em = getEntityManager();
		const importEntity = await getImportEntity( em );
		const rawClaims = [
			{
				'Claim Received': 'yes',
				'Provided By': 'Dr. Test',
			},
		];
		const providers = await getAndInsertProviders(
			rawClaims,
			em,
			importEntity
		);
		const importEntityLoaded = await providers.pop()?.import;
		expect( importEntityLoaded ).toMatchObject( importEntity );
	} );
} );

describe( 'parseCSV', () => {
	test.todo( 'it creates an import row' );
	test.todo( 'throws if identical hash provided' );
	test.todo( 'gets providers' );
	test.todo( 'gets old claims and just inserts if none' );
	test.todo( 'inserts new claims' );
	test.todo( 'skips identical claims' );
	test.todo( 'inserts updated claim' );
	test.todo( 'updates old claim' );
} );
