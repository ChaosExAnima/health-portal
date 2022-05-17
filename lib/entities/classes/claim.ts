import {
	CLAIM_STATUSES,
	CLAIM_STATUS_TYPE,
	CLAIM_STATUS_UNKNOWN,
	CLAIM_TYPES,
	CLAIM_TYPES_TYPE,
	CLAIM_TYPE_OTHER,
} from 'lib/constants';
import { ContentDB, MetaDB } from 'lib/db/types';
import { slugify } from 'lib/strings';

import { ClaimInput } from '../types';
import { inReadonlyArray } from '../utils';
import Content from './content';

export default class Claim extends Content {
	public type: CLAIM_TYPES_TYPE;
	public status: CLAIM_STATUS_TYPE;
	public billed?: number;
	public cost?: number;
	public paid = 0;
	public provider: never;

	public get number(): string {
		return String( this.slug );
	}

	public loadFromForm( { number, ...input }: ClaimInput ): this {
		this.slug = slugify( number );
		return super.loadFromForm( input );
	}

	public loadFromDB( row: ContentDB ): this {
		this.status = inReadonlyArray(
			row.status,
			CLAIM_STATUSES,
			CLAIM_STATUS_UNKNOWN
		);
		this.type = inReadonlyArray(
			String( row.info ),
			CLAIM_TYPES,
			CLAIM_TYPE_OTHER
		);
		return super.loadFromDB( row );
	}

	protected setFromMeta( key: string, value: any ): void {
		switch ( key ) {
			case 'billed':
				this.billed = Number.parseFloat( value );
				break;
			case 'cost':
				this.cost = Number.parseFloat( value );
		}
	}
}
