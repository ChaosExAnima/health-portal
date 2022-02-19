import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { ValidationError } from 'yup';

import { CONTENT_CALL, TABLE_CONTENT, TABLE_PROVIDERS } from 'lib/constants';
import getDB from 'lib/db';
import { callSchema } from 'lib/entities/schemas';
import { slugify } from 'lib/strings';

import type { Knex } from 'knex';
import type { ErrorInformation, NewResponse } from 'lib/api/types';
import type { CallInput } from 'lib/entities/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< NewResponse >
) {
	try {
		const input = ( await callSchema.validate( req.body ) ) as CallInput;

		const knex = getDB();
		knex.transaction( async ( trx ) => {
			const slug = await saveCall( input, trx );
			res.status( 200 ).json( {
				success: true,
				slug,
			} );
		} );
	} catch ( err ) {
		if ( err instanceof ValidationError ) {
			return res.status( 400 ).json( {
				success: false,
				errors: err.errors,
			} );
		}
		let errors: Array< string | ErrorInformation > = [];
		if ( err instanceof Error ) {
			errors = [ { code: err.name, text: err.message } ];
		}
		return res.status( 500 ).json( {
			success: false,
			errors,
		} );
	}
}

async function saveCall(
	input: CallInput,
	trx: Knex.Transaction
): Promise< string > {
	const { provider, created, reason, result } = input;
	let providerId = null;
	let providerName = null;
	if ( typeof provider === 'number' ) {
		providerId = provider;
		const providerRow = await trx( TABLE_PROVIDERS )
			.where( 'id', providerId )
			.first();
		if ( ! providerRow ) {
			throw new ValidationError(
				'Could not find provider',
				providerId,
				'provider'
			);
		}
		providerName = providerRow.name;
	} else if ( provider && 'name' in provider ) {
		[ providerId ] = await trx( TABLE_PROVIDERS ).insert( {
			slug: slugify( provider.name ),
			name: provider.name,
		} );
		providerName = provider.name;
	}

	if ( ! providerId || ! providerName ) {
		throw new Error( 'Could not get provider' );
	}

	const slug = slugify(
		dayjs( created ).format( `YYYY-MM-DD [${ providerName }]` )
	);
	const [ id ] = await trx( TABLE_CONTENT ).insert( {
		type: CONTENT_CALL,
		created,
		identifier: slug,
		info: reason,
		status: result,
		providerId,
	} );

	if ( ! id ) {
		throw new Error( 'Could not save call' );
	}

	return slug;
}
