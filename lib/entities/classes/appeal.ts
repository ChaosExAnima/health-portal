import {
	APPEAL_STATUSES,
	APPEAL_STATUSES_TYPE,
	APPEAL_STATUS_PENDING,
} from 'lib/constants';
import { ContentDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

import { AppealInput } from '../types';
import { inReadonlyArray } from '../utils';
import Entity from './entity';

export default class Appeal extends Entity {
	protected name: string;
	protected status: APPEAL_STATUSES_TYPE;
	protected claims?: never;
	protected provider?: never;

	public loadFromForm( { name, status, ...rest }: AppealInput ) {
		this.name = name;
		this.status = status;
		return super.loadFromForm( rest );
	}

	public loadFromDB( { identifier, status, ...rest }: ContentDB ) {
		this.name = identifier;
		this.slug = slugify( identifier );
		this.status = inReadonlyArray(
			status,
			APPEAL_STATUSES,
			APPEAL_STATUS_PENDING
		);
		return super.loadFromDB( rest );
	}
}
