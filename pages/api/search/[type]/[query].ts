import { NextApiRequest, NextApiResponse } from 'next';

import * as constants from 'lib/constants';
import { inReadonlyArray } from 'lib/entities/utils';

import type { AutocompleteResponse } from 'components/form/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< AutocompleteResponse >
) {
	const {
		query: { query, type },
	} = req;
	if ( Array.isArray( query ) || Array.isArray( type ) ) {
		return res.json( {
			success: false,
			errors: [ 'Invalid query or type' ],
		} );
	}
	// @TODO Finish this!

	if (
		! inReadonlyArray( type, constants.CONTENTS ) &&
		type !== 'provider'
	) {
		return res.json( {
			success: false,
			errors: [ 'Invalid type' ],
		} );
	}

	res.json( {
		success: true,
		options: [ { label: 'Test', id: 123 } ],
	} );
}
