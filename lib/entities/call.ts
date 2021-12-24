import { Call } from './types';
import { dateToString } from './utils';

import type { ContentDB } from 'lib/db/types';

export default function rowToCall( row: ContentDB ): Call {
	const { id, identifier: slug } = row;
	const call: Call = {
		id,
		slug,
		created: dateToString( row.created ),
	};
	return call;
}
