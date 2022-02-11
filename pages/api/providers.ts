import * as yup from 'yup';

import { queryAllProviders } from 'lib/db/helpers';
import { rowToProvider } from 'lib/entities/provider';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { RecordsResponse } from 'lib/api/types';
import type { Provider } from 'lib/entities/types';

const querySchema = yup.object( {
	offset: yup.number().min( 0 ).default( 0 ),
	limit: yup
		.number()
		.min( 1, 'Limit needs to be more than zero' )
		.max( 100, 'Limit cannot exceed 100' )
		.default( 100 ),
} );
type QuerySchema = yup.InferType< typeof querySchema >;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< RecordsResponse< Provider > >
) {
	try {
		const { offset, limit }: QuerySchema = await querySchema.validate(
			req.query
		);

		const providers = await queryAllProviders()
			.limit( limit )
			.offset( offset );
		const records = providers.map( ( row ) => rowToProvider( row ) );
		res.status( 200 ).json( {
			success: true,
			records,
		} );
	} catch ( err ) {
		let error = 'Unknown error';
		if ( err instanceof Error ) {
			error = err.message;
		} else if ( typeof err === 'string' ) {
			error = err;
		}
		res.status( 400 ).json( {
			success: false,
			errors: [ error ],
		} );
	}
}
