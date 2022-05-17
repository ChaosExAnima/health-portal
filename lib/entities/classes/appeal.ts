import {
	APPEAL_STATUSES,
	APPEAL_STATUSES_TYPE,
	APPEAL_STATUS_PENDING,
} from 'lib/constants';
import { slugify } from 'lib/strings';

import { inReadonlyArray } from '../utils';
import Content from './content';

import type { AppealInput } from '../types';
import type { ContentDB } from 'lib/db/types';

export default class Appeal extends Content {
	protected name: string;
	protected status: APPEAL_STATUSES_TYPE;
	protected claims?: never;
	protected provider?: never;

	public loadFromForm( { name, status, ...rest }: AppealInput ) {
		this.name = name;
		this.status = status;
		return super.loadFromForm( rest );
	}

	public loadFromDB( row: ContentDB ) {
		this.name = row.identifier;
		this.slug = slugify( row.identifier );
		this.status = inReadonlyArray(
			row.status,
			APPEAL_STATUSES,
			APPEAL_STATUS_PENDING
		);
		return super.loadFromDB( row );
	}
}
