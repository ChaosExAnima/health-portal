import {
	PAYMENT_SOURCES,
	PAYMENT_SOURCE_TYPE,
	PAYMENT_SOURCE_UNKNOWN,
} from 'lib/constants';
import { formatCurrency } from 'lib/strings';

import { inReadonlyArray } from '../utils';

import type { PaymentMeta } from '../types';
import type { MetaDB } from 'lib/db/types';

export default class Payment extends String {
	protected id: number;
	public date: Date;
	public amount: number;
	public source: PAYMENT_SOURCE_TYPE;
	protected claimId: number;

	public constructor( row: MetaDB< PaymentMeta > ) {
		super( row.value ?? '0' );
		this.id = row.id;
		this.date = row.created;
		this.amount = Number.parseFloat( row.value ?? '0' );
		this.source = inReadonlyArray(
			row.meta?.source,
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
