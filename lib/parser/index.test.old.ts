import { Readable } from 'stream';

import parseCSV, {
	getAndInsertProviders,
	getImportOrThrow,
	readCSV,
	saveClaims,
} from './index';
import { arrToCSVStream } from './test-utils';

const rootClaim = {
	number: '1234',
	status: 'pending',
	type: 'test',
} as const;
const rawClaim = {
	...rootClaim,
	serviceDate: '2021-01-01 12:00:00',
	billed: '1.23',
	cost: '1.23',
} as const;

describe( 'readCSV', () => {
	test( 'converts readable stream to CSV', async () => {
		const stream = arrToCSVStream( [ 'key1', 'key2' ], [ 'val1', 'val2' ] );
		const csv = readCSV( stream );
		await expect( csv ).resolves.toEqual( [
			{
				key1: 'val1',
				key2: 'val2',
			},
		] );
	} );
	test( 'rejects on invalid format', async () => {
		const stream = arrToCSVStream(
			[ 'key1', 'key2' ],
			[ 'val1', 'val2', 'val3' ]
		);
		const csv = readCSV( stream );
		expect( csv ).rejects.toThrow();
	} );
} );

describe( 'getAndInsertProviders', () => {
	// beforeEach( createTestDB );
	// afterEach( resetTestDB );

	test.skip( 'will return providers', async () => {
		// const em = getEntityManager();
		// const rawClaims = [ { provider: 'Dr. Test' } ];
		// const providers = await getAndInsertProviders(
		// 	rawClaims,
		// 	em,
		// 	await getImportEntity( em )
		// );
		// expect( providers ).toHaveLength( 1 );
	} );

	test.skip( 'will not create duplicates', async () => {
		// const em = getEntityManager();
		// const rawClaims = [
		// 	{ provider: 'Dr. Test' },
		// 	{ provider: 'Dr. Test' },
		// ];
		// const providers = await getAndInsertProviders(
		// 	rawClaims,
		// 	em,
		// 	await getImportEntity( em )
		// );
		// expect( providers ).toHaveLength( 1 );
	} );

	test.skip( 'will not overwrite', async () => {
		// const em = getEntityManager();
		// const importEntity = await getImportEntity( em );
		// const rawClaims = [
		// 	{
		// 		'Claim Received': 'yes',
		// 		'Provided By': 'Dr. Test',
		// 	},
		// ];
		// const providerRepo = em.getRepository< Provider >( 'Provider' );
		// await providerRepo.save( { slug: 'dr-test', name: 'Dr. Test' } );
		// const providers = await getAndInsertProviders(
		// 	rawClaims,
		// 	em,
		// 	importEntity
		// );
		// expect( providers ).toHaveLength( 1 );
	} );

	test.skip( 'will attach import', async () => {
		// const em = getEntityManager();
		// const importEntity = await getImportEntity( em );
		// const rawClaims = [
		// 	{
		// 		'Claim Received': 'yes',
		// 		'Provided By': 'Dr. Test',
		// 	},
		// ];
		// const providers = await getAndInsertProviders(
		// 	rawClaims,
		// 	em,
		// 	importEntity
		// );
		// const importEntityLoaded = await providers.pop()?.import;
		// expect( importEntityLoaded ).toMatchObject( importEntity );
	} );

	test.skip( 'will skip unparsable claims', async () => {
		// const em = getEntityManager();
		// const importEntity = await getImportEntity( em );
		// const providers = await getAndInsertProviders(
		// 	[ { test: 'foo' } ],
		// 	em,
		// 	importEntity
		// );
		// expect( providers ).toHaveLength( 0 );
	} );

	test.skip( 'will not try and save if no providers added', async () => {
		// const em = getEntityManager();
		// const providerRepo = em.getRepository( 'Provider' );
		// const importEntity = await getImportEntity( em );
		// const createSpy = jest.spyOn( providerRepo, 'create' );
		// const saveSpy = jest.spyOn( providerRepo, 'save' );
		// jest.spyOn( em, 'getRepository' ).mockReturnValueOnce( providerRepo );
		// const providers = await getAndInsertProviders( [], em, importEntity );
		// expect( providers ).toHaveLength( 0 );
		// expect( createSpy ).not.toHaveBeenCalled();
		// expect( saveSpy ).not.toHaveBeenCalled();
	} );
} );

describe( 'getImportOrThrow', () => {
	// beforeEach( createTestDB );
	// afterEach( resetTestDB );

	test.skip( 'it creates an import row', async () => {
		// const em = getEntityManager();
		// await getImportOrThrow( [], em );
		// const imports = await em.find( 'Import' );
		// expect( imports ).toHaveLength( 1 );
	} );

	test.skip( 'throws if identical hash provided', async () => {
		// const em = getEntityManager();
		// const importRepo = em.getRepository< Import >( 'Import' );
		// await importRepo.save( {
		// 	hash: 'd751713988987e9331980363e24189ce',
		// } );
		// expect( () => getImportOrThrow( [], em ) ).rejects.toThrow(
		// 	'Claims have been previously uploaded'
		// );
		// expect( await importRepo.find() ).toHaveLength( 1 );
	} );
} );

describe( 'saveClaims', () => {
	// beforeEach( createTestDB );
	// afterEach( resetTestDB );

	test.skip( 'rejects when unknown format is imported', async () => {
		// const em = await getEntityManager();
		// const saveResult = saveClaims(
		// 	[ { test: 'foo' } ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).rejects.toThrow();
	} );
	test.skip( 'no input is both zeros', async () => {
		// const em = await getEntityManager();
		// const saveResult = await saveClaims(
		// 	[],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 0,
		// 	updated: 0,
		// } );
	} );
	test.skip( 'gets old claims and just inserts if none', async () => {
		// const em = await getEntityManager();
		// const saveResult = await saveClaims(
		// 	[ rawClaim ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 1,
		// 	updated: 0,
		// } );
		// await expect( em.find( 'Claim' ) ).resolves.toHaveLength( 1 );
	} );
	test.skip( 'inserts new claims', async () => {
		// const em = await getEntityManagerWithClaim();
		// const saveResult = await saveClaims(
		// 	[ { ...rawClaim, number: '2345' } ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 1,
		// 	updated: 0,
		// } );
		// await expect( em.find( 'Claim' ) ).resolves.toHaveLength( 2 );
	} );
	test.skip( 'sets import entity on claims', async () => {
		// const em = await getEntityManager();
		// const importEntity = await getImportEntity( em );
		// await saveClaims( [ rawClaim ], [], importEntity, em );
		// const claim = await em.findOne< Claim >( 'Claim' );
		// expect( claim ).not.toBeFalsy();
		// await expect( claim?.import ).resolves.toEqual( importEntity );
	} );
	test.skip( 'skips duplicate input claims', async () => {
		// const em = await getEntityManager();
		// const saveResult = await saveClaims(
		// 	[ rawClaim, rawClaim ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 1,
		// 	updated: 0,
		// } );
		// expect( await em.find( 'Claim' ) ).toHaveLength( 1 );
	} );
	test.skip( 'does not insert on identical existing claim', async () => {
		// const em = await getEntityManagerWithClaim();
		// const saveResult = await saveClaims(
		// 	[ rawClaim ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 0,
		// 	updated: 0,
		// } );
		// expect( await em.find( 'Claim' ) ).toHaveLength( 1 );
	} );
	test.skip( 'updates existing claim', async () => {
		// const em = await getEntityManagerWithClaim();
		// const updatedClaim = {
		// 	...rawClaim,
		// 	status: 'denied',
		// };
		// const saveResult = await saveClaims(
		// 	[ updatedClaim ],
		// 	[],
		// 	await getImportEntity( em ),
		// 	em
		// );
		// expect( saveResult ).toMatchObject( {
		// 	inserted: 0,
		// 	updated: 1,
		// } );
		// expect( await em.find( 'Claim' ) ).toHaveLength( 2 );
		// const savedClaim = await em.findOne< Claim >( 'Claim', 1 );
		// expect( savedClaim ).toHaveProperty( 'parent' );
		// await expect( savedClaim?.parent ).resolves.toHaveProperty(
		// 	'status',
		// 	'denied'
		// );
	} );
} );

describe( 'parseCSV', () => {
	// beforeEach( createTestDB );
	// afterEach( resetTestDB );

	test.skip( 'uses a transaction', async () => {
		// const csvStream = new Readable();
		// const em = getEntityManager();
		// const transactionSpy = jest
		// 	.spyOn( em, 'transaction' )
		// 	.mockImplementation( () => Promise.resolve() );
		// const parse = parseCSV( csvStream, em );
		// await expect( parse ).resolves.toEqual( 0 );
		// expect( transactionSpy ).toHaveBeenCalled();
	} );

	test.skip( 'sets correct insert on import entity', async () => {
		// const em = await getEntityManager();
		// const rawClaimWithProvider = {
		// 	...rawClaim,
		// 	provider: 'Dr. Test',
		// } as const;
		// const csvStream = arrToCSVStream(
		// 	Object.keys( rawClaimWithProvider ),
		// 	Object.values( rawClaimWithProvider )
		// );
		// await expect( parseCSV( csvStream, em ) ).resolves.toEqual( 1 );
		// const importRepo = em.getRepository< Import >( 'Import' );
		// await expect( importRepo.findOneOrFail() ).resolves.toMatchObject( {
		// 	inserted: 1,
		// 	updated: 0,
		// } );
	} );

	test.skip( 'sets correct update on import entity', async () => {
		// const em = await getEntityManagerWithClaim();
		// const rawClaimWithProvider = {
		// 	...rawClaim,
		// 	status: 'DENIED',
		// 	provider: 'Dr. Test',
		// } as const;
		// const csvStream = arrToCSVStream(
		// 	Object.keys( rawClaimWithProvider ),
		// 	Object.values( rawClaimWithProvider )
		// );
		// await expect( parseCSV( csvStream, em ) ).resolves.toEqual( 1 );
		// const importRepo = em.getRepository< Import >( 'Import' );
		// await expect( importRepo.findOneOrFail() ).resolves.toMatchObject( {
		// 	inserted: 0,
		// 	updated: 1,
		// } );
	} );
} );
