import { NextApiRequest, NextApiResponse } from 'next';

import * as constants from 'lib/constants';
import { inReadonlyArray } from 'lib/entities/utils';

import type { AutocompleteResponse } from 'components/autocomplete-field/types';

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

	if (
		! inReadonlyArray( type, constants.CONTENTS ) &&
		type !== 'provider'
	) {
		return res.json( {
			success: false,
			errors: [ 'Invalid type' ],
		} );
	}
	console.log( 'Server responded to:', query );

	res.json( {
		success: true,
		options: [ { label: 'Test', id: 123 } ],
	} );
}
