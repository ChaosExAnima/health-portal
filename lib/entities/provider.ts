import { ProviderDB } from 'lib/db/types';

import { dateToString } from './utils';
import { Provider } from './types';

export function rowToProvider( row: ProviderDB ): Provider {
	return {
		...row,
		created: dateToString( row.created ),
	};
}
