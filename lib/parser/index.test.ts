import {
	getAndInsertProviders,
	getImportOrThrow,
	isClaimSame,
	saveClaims,
} from './index';
import Claim from 'lib/db/entities/claim';

import type Import from 'lib/db/entities/import';
import type Provider from 'lib/db/entities/provider';
import { createTestDB, getEntityManager, resetTestDB } from 'lib/db/test-utils';
import { getImportEntity } from './test-utils';

const rootClaim = {
	number: '1234',
	status: 'pending',
	type: 'test',
} as const;
const baseClaim = {
	...rootClaim,
	slug: 'test',
	serviceDate: new Date( 2021, 0, 1, 12 ),
	billed: 1.23,
	cost: 1.23,
} as const;
const rawClaim = {
	...rootClaim,
	serviceDate: '2021-01-01 12:00:00',
	billed: '1.23',
	cost: '1.23',
} as const;

describe( 'readCSV', () => {
	test.todo( 'converts readable stream to CSV' );
	test.todo( 'rejects on invalid format' );
} );

describe( 'isClaimSame', () => {
	test( 'returns true on identical claims', () => {
		const claim1 = new Claim( baseClaim );
		const claim2 = new Claim( baseClaim );
		expect( isClaimSame( claim1, claim2 ) ).toBeTruthy();
	} );

	function getDiffOnKey(
		claimKey: keyof typeof baseClaim
	): string | Date | number {
		switch ( typeof baseClaim[ claimKey ] ) {
			case 'string':
				return 'changed';
			case 'object':
				return new Date( 2000, 1 );
			case 'number':
				return 4.56;
			default:
				throw new Error(
					'Unknown type: ' + typeof baseClaim[ claimKey ]
				);
		}
	}

	test( 'returns false on claim with different keys', () => {
		Object.keys( baseClaim )
			.filter( ( claimKey ) => ! [ 'slug' ].includes( claimKey ) )
			.forEach( ( claimKey: keyof typeof baseClaim ) => {
				const claim1 = new Claim( { ...baseClaim } );
				const claim2 = new Claim( {
					...baseClaim,
					[ claimKey ]: getDiffOnKey( claimKey ),
				} );
				expect( isClaimSame( claim1, claim2 ) ).toBeFalsy();
			} );
	} );
} );

describe( 'getHash', () => {
	test.todo( 'gets correct hash for empty array' );
	test.todo( 'gets correct hash with dummy data' );
	test.todo( 'returns length from second arg' );
} );

describe( 'getAndInsertProviders', () => {
	beforeEach( createTestDB );
	afterEach( resetTestDB );

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
	beforeEach( createTestDB );
	afterEach( resetTestDB );

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
	beforeEach( createTestDB );
	afterEach( resetTestDB );

	async function getEntityManagerWithClaim() {
		const em = getEntityManager();
		await em.insert( 'Claim', {
			...baseClaim,
			slug: 'test1',
		} );
		return em;
	}

	test( 'rejects when unknown format is imported', async () => {
		const em = await getEntityManager();
		const saveResult = saveClaims(
			[ { test: 'foo' } ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).rejects.toThrow();
	} );
	test( 'no input is both zeros', async () => {
		const em = await getEntityManager();
		const saveResult = await saveClaims(
			[],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 0,
			updated: 0,
		} );
	} );
	test( 'gets old claims and just inserts if none', async () => {
		const em = await getEntityManager();
		const saveResult = await saveClaims(
			[ rawClaim ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 1,
			updated: 0,
		} );
		expect( ( await em.find( 'Claim' ) ).length ).toEqual( 1 );
	} );
	test( 'inserts new claims', async () => {
		const em = await getEntityManagerWithClaim();
		const saveResult = await saveClaims(
			[ { ...rawClaim, number: '2345' } ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 1,
			updated: 0,
		} );
		expect( ( await em.find( 'Claim' ) ).length ).toEqual( 2 );
	} );
	test( 'sets import entity on claims', async () => {
		const em = await getEntityManager();
		const importEntity = await getImportEntity( em );
		await saveClaims( [ rawClaim ], [], importEntity, em );

		const claim = await em.findOne< Claim >( 'Claim' );
		expect( claim ).not.toBeFalsy();
		expect( claim?.import ).resolves.toEqual( importEntity );
	} );
	test( 'skips duplicate input claims', async () => {
		const em = await getEntityManager();
		const saveResult = await saveClaims(
			[ rawClaim, rawClaim ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 1,
			updated: 0,
		} );
		expect( await em.find( 'Claim' ) ).toHaveLength( 1 );
	} );
	test( 'skips inserting identical existing claim', async () => {
		const em = await getEntityManagerWithClaim();
		const saveResult = await saveClaims(
			[ rawClaim ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 0,
			updated: 0,
		} );
		expect( await em.find( 'Claim' ) ).toHaveLength( 1 );
	} );
	test( 'updates existing claim', async () => {
		const em = await getEntityManagerWithClaim();
		const updatedClaim = {
			...rawClaim,
			status: 'denied',
		};
		const saveResult = await saveClaims(
			[ updatedClaim ],
			[],
			await getImportEntity( em ),
			em
		);
		expect( saveResult ).toMatchObject( {
			inserted: 0,
			updated: 1,
		} );
		expect( await em.find( 'Claim' ) ).toHaveLength( 2 );
		const savedClaim = await em.findOne< Claim >( 'Claim', 1 );
		expect( savedClaim ).toHaveProperty( 'parent' );
		expect( savedClaim?.parent ).resolves.toHaveProperty(
			'status',
			'denied'
		);
	} );
} );
