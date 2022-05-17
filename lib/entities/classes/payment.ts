import {
	PAYMENT_SOURCES,
	PAYMENT_SOURCE_TYPE,
	PAYMENT_SOURCE_UNKNOWN,
} from 'lib/constants';
import { MetaDB } from 'lib/db/types';
import { formatCurrency } from 'lib/strings';

import { inReadonlyArray } from '../utils';

export default class Payment {
	protected id: number;
	public date: Date;
	public amount: number;
	public source: PAYMENT_SOURCE_TYPE;
	protected claimId: number;

	public constructor( row: MetaDB ) {
		this.id = row.id;
		this.date = row.created;
		this.amount = Number.parseFloat( row.value ?? '0' );
		this.source = inReadonlyArray(
			row.meta?.row,
			PAYMENT_SOURCES,
			PAYMENT_SOURCE_UNKNOWN
		);
		this.claimId = row.contentId;
		return this;
	}

	public toString(): string {
		return formatCurrency( this.amount );
	}
}
