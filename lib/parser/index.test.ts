import { Readable } from 'stream';
import ImportParser from './index';
import { arrToCSVStream, getEntityManagerWithClaim } from './test-utils';
import { createTestDB, getEntityManager, resetTestDB } from 'lib/db/test-utils';

import type Import from 'lib/db/entities/import';

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

describe( 'ImportParser', () => {
	describe( 'parse', () => {
		beforeEach( createTestDB );
		afterEach( resetTestDB );

		test( 'uses a transaction', async () => {
			const csvStream = new Readable();

			const em = getEntityManager();
			const transactionSpy = jest
				.spyOn( em, 'transaction' )
				.mockImplementation( () => Promise.resolve() );

			const parser = new ImportParser( em );
			await parser.parse( csvStream );
			expect( parser.getTotalUpdated() ).toEqual( 0 );
			expect( transactionSpy ).toHaveBeenCalled();
		} );

		test( 'sets correct insert on import entity', async () => {
			const em = await getEntityManager();
			const rawClaimWithProvider = {
				...rawClaim,
				provider: 'Dr. Test',
			} as const;
			const csvStream = arrToCSVStream(
				Object.keys( rawClaimWithProvider ),
				Object.values( rawClaimWithProvider )
			);
			const parser = new ImportParser( em );
			await parser.parse( csvStream );
			expect( parser.getTotalUpdated() ).toEqual( 1 );

			const importRepo = em.getRepository< Import >( 'Import' );
			await expect( importRepo.findOneOrFail() ).resolves.toMatchObject( {
				inserted: 1,
				updated: 0,
			} );
		} );

		test( 'sets correct update on import entity', async () => {
			const em = await getEntityManagerWithClaim();
			const rawClaimWithProvider = {
				...rawClaim,
				status: 'DENIED',
				provider: 'Dr. Test',
			} as const;
			const csvStream = arrToCSVStream(
				Object.keys( rawClaimWithProvider ),
				Object.values( rawClaimWithProvider )
			);
			const parser = new ImportParser( em );
			await parser.parse( csvStream );
			expect( parser.getTotalUpdated() ).toEqual( 1 );

			const importRepo = em.getRepository< Import >( 'Import' );
			await expect( importRepo.findOneOrFail() ).resolves.toMatchObject( {
				inserted: 0,
				updated: 1,
			} );
		} );
	} );
} );
