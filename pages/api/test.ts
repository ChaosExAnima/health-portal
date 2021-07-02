import { NextApiRequest, NextApiResponse } from 'next';

import initOrm from 'lib/db';
import { Claim } from 'lib/db/entities';

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse
): Promise< void > {
	try {
		const connection = await initOrm();
		const results = await connection
			.createQueryBuilder< Claim >( 'Claim', 'claims' )
			.getOne();
		res.status( 200 ).json( results );
	} catch ( err ) {
		res.status( 500 ).json( err );
	}
}
