import type { DeepPartial, EntityManager } from 'typeorm';
import type { Claim, Import } from 'lib/db/entities';

type TestClaim = {
	slug?: string;
	number: string;
	status: string;
	serviceDate: Date;
	type: string;
	billed: number;
	cost: number;
};
type RawTestClaim = Record< keyof TestClaim, string >;

export function isTestClaim(
	rawClaim: Record< string, string >
): rawClaim is RawTestClaim {
	return (
		'number' in rawClaim &&
		'status' in rawClaim &&
		'serviceDate' in rawClaim &&
		'type' in rawClaim &&
		'billed' in rawClaim &&
		'cost' in rawClaim
	);
}

export function parseTestClaim( claim: RawTestClaim ): DeepPartial< Claim > {
	return {
		...claim,
		serviceDate: new Date( claim.serviceDate ),
		billed: Number.parseFloat( claim.billed ),
		cost: Number.parseFloat( claim.cost ),
	};
}

export async function getImportEntity( em: EntityManager ): Promise< Import > {
	const importRepo = em.getRepository< Import >( 'Import' );
	return importRepo.save( {
		hash: 'test1234',
	} );
}
