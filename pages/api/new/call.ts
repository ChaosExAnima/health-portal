import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { ValidationError } from 'yup';

import { CONTENT_CALL, TABLE_CONTENT, TABLE_PROVIDERS } from 'lib/constants';
import getDB from 'lib/db';
import { slugify } from 'lib/strings';
import { callSchema, NewCallInput } from './callSchema';

import type { Knex } from 'knex';
import type { ErrorInformation, NewResponse } from 'lib/api/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< NewResponse >
) {
	try {
		const input = await callSchema.validate( req.body );

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
	input: NewCallInput,
	trx: Knex.Transaction
): Promise< string > {
	let providerId = null;
	let providerName = null;
	if ( input.provider.id ) {
		providerId = input.provider.id;
		const provider = await trx( TABLE_PROVIDERS )
			.where( 'id', providerId )
			.first();
		if ( ! provider ) {
			throw new ValidationError(
				'Could not find provider',
				providerId,
				'provider'
			);
		}
		providerName = provider.name;
	} else if ( input.provider.id === 0 ) {
		providerId = await trx( TABLE_PROVIDERS )
			.insert( {
				slug: slugify( input.provider.name ),
				name: input.provider.name,
			} )
			.first();
		providerName = input.provider.name;
	}

	if ( ! providerId || ! providerName ) {
		throw new Error( 'Could not get provider' );
	}

	const created = input.date;
	const slug = slugify(
		dayjs( input.date ).format( `YYYY-MM-DD [${ providerName }]` )
	);
	const id = await trx( TABLE_CONTENT )
		.insert( {
			type: CONTENT_CALL,
			created,
			identifier: slug,
			info: input.reason,
			status: input.result,
			providerId,
		} )
		.first();

	if ( ! id ) {
		throw new Error( 'Could not save call' );
	}

	return slug;
}
