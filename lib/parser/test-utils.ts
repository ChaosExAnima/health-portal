import { getEntityManager } from 'lib/db/test-utils';
import { Readable } from 'stream';
import type { DeepPartial, EntityManager } from 'typeorm';
import type { Claim, Import, Provider } from 'lib/db/entities';

type RawTestClaim =
	| {
			number: string;
			status: string;
			type: string;
			serviceDate: string;
			billed: string;
			cost: string;
			provider?: string;
	  }
	| { provider: string };

export function isTestClaim(
	rawClaim: Record< string, string | undefined >
): rawClaim is RawTestClaim {
	return (
		( 'number' in rawClaim &&
			'status' in rawClaim &&
			'serviceDate' in rawClaim &&
			'type' in rawClaim &&
			'billed' in rawClaim &&
			'cost' in rawClaim ) ||
		'provider' in rawClaim
	);
}

export function getProviderFromTestClaim( rawClaim: RawTestClaim ): string {
	if ( ! ( 'provider' in rawClaim ) || ! rawClaim.provider ) {
		throw new Error( 'Invalid test claim type' );
	}
	return rawClaim.provider;
}

export function parseTestClaim(
	rawClaim: RawTestClaim,
	providers: Provider[]
): DeepPartial< Claim > {
	if ( ! ( 'serviceDate' in rawClaim ) ) {
		throw new Error( 'Invalid test claim type' );
	}
	return {
		...rawClaim,
		serviceDate: new Date( rawClaim.serviceDate ),
		billed: Number.parseFloat( rawClaim.billed ),
		cost: Number.parseFloat( rawClaim.cost ),
		provider: providers && Promise.resolve( providers[ 0 ] ),
	};
}

export function arrToCSVStream( ...rows: string[][] ): Readable {
	return Readable.from(
		rows.map( ( row ) => `"${ row.join( '","' ) }"` ).join( '\n' )
	);
}

export const baseClaim = {
	number: '1234',
	status: 'pending',
	type: 'test',
	slug: 'test',
	serviceDate: new Date( 2021, 0, 1, 12 ),
	billed: 1.23,
	cost: 1.23,
} as const;

export async function getEntityManagerWithClaim(): Promise< EntityManager > {
	const em = getEntityManager();
	await em.insert( 'Claim', {
		...baseClaim,
		slug: 'test1',
	} );
	return em;
}

export async function getImportEntity( em: EntityManager ): Promise< Import > {
	const importRepo = em.getRepository< Import >( 'Import' );
	await importRepo.insert( {
		id: 1,
		hash: 'test1234',
	} );
	return importRepo.findOneOrFail( 1 );
}
