import { ProviderDB } from 'lib/db/types';

import { dateToString, isEntity } from './utils';
import { Provider } from './types';
import { isObjectWithKeys } from 'lib/casting';

export function isProvider( input: unknown ): input is Provider {
	return (
		isEntity( input ) &&
		isObjectWithKeys( input, [
			'slug',
			'name',
			'address',
			'phone',
			'email',
			'website',
		] )
	);
}

export function rowToProvider( row: ProviderDB ): Provider {
	return {
		...row,
		created: dateToString( row.created ),
	};
}
