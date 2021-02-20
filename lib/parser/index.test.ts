import { createConnection, EntityManager, getConnection } from 'typeorm';

import { getAndInsertProviders, getImportOrThrow } from './index';
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

describe( 'readCSV', () => {
	test.todo( 'converts readable stream to CSV' );
	test.todo( 'rejects on invalid format' );
} );

describe( 'isClaimSame', () => {
	test.todo( 'returns true on identical claims' );
	test.todo( 'returns false on different claims' );
} );

describe( 'getHash', () => {
	test.todo( 'gets correct hash for empty array' );
	test.todo( 'gets correct hash with dummy data' );
	test.todo( 'returns length from second arg' );
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

describe( 'getImportOrThrow', () => {
	test( 'it creates an import row', async () => {
		const em = getEntityManager();
		await getImportOrThrow( [], em );
		const imports = await em.find( 'Import' );
		expect( imports ).toHaveLength( 1 );
	} );

	test( 'throws if identical hash provided', async () => {
		const em = getEntityManager();
		const importRepo = em.getRepository< Import >( 'Import' );
		await importRepo.save( {
			hash: 'd751713988987e9331980363e24189ce',
		} );
		expect( () => getImportOrThrow( [], em ) ).rejects.toThrow(
			'Claims have been previously uploaded'
		);
		expect( await importRepo.find() ).toHaveLength( 1 );
	} );
} );

describe( 'saveClaims', () => {
	test.todo( 'rejects when unknown format is imported' );
	test.todo( 'gets old claims and just inserts if none' );
	test.todo( 'inserts new claims' );
	test.todo( 'sets import entity to claims' );
	test.todo( 'skips identical claims' );
	test.todo( 'inserts updated claim' );
	test.todo( 'updates old claim' );
} );
