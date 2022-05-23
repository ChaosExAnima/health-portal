import {
	APPEAL_STATUSES,
	APPEAL_STATUSES_TYPE,
	APPEAL_STATUS_PENDING,
	CONTENTS_TYPE,
} from 'lib/constants';
import { slugify } from 'lib/strings';

import { inReadonlyArray } from '../utils';
import Content from './content';

import type { AppealInput } from '../types';
import type Claim from './claim';
import type { ContentDB } from 'lib/db/types';

export default class Appeal extends Content {
	public name: string;
	public status: APPEAL_STATUSES_TYPE;
	public claims: Claim[] = [];

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

	public toDB(): ContentDB {
		const row = super.toDB();
		row.status = this.status;
		row.identifier = this.name;
		return row;
	}

	protected setRelation( type: CONTENTS_TYPE, relation: Content ): void {
		if ( type === 'claim' ) {
			this.claims.push( relation as Claim );
		}
	}
}
