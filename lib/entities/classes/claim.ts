import {
	CLAIM_STATUSES,
	CLAIM_STATUS_TYPE,
	CLAIM_STATUS_UNKNOWN,
	CLAIM_TYPES,
	CLAIM_TYPES_TYPE,
	CLAIM_TYPE_OTHER,
	CONTENTS_TYPE,
} from 'lib/constants';
import { slugify } from 'lib/strings';

import { inReadonlyArray } from '../utils';
import Content from './content';
import Payment from './payment';

import type { ClaimInput, PaymentMeta } from '../types';
import type Appeal from './appeal';
import type Call from './call';
import type { ContentDB, MetaDB, NewMetaDB } from 'lib/db/types';

export default class Claim extends Content {
	public type: CLAIM_TYPES_TYPE;
	public status: CLAIM_STATUS_TYPE;
	public billed?: number;
	public cost?: number;
	public paid = 0;
	public payments: Payment[] = [];
	public appeals: Appeal[] = [];
	public calls: Call[] = [];

	public get number(): string {
		return String( this.slug );
	}

	public get reimbursed(): number {
		return this.payments.reduce( ( a, b ) => a + b.amount, 0 );
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

	public toMeta(): NewMetaDB[] {
		return [
			...( [ 'billed', 'cost', 'paid' ] as const ).map( ( key ) =>
				this.fillMeta( key, <any>this[ key ] )
			),
			...this.payments.map( ( payment ) =>
				this.fillMeta( 'payments', undefined, payment )
			),
		];
	}

	public setMeta(
		key: string,
		value?: string,
		meta?: MetaDB< PaymentMeta >
	): void {
		if ( ! value || ! meta ) {
			return;
		}
		switch ( key ) {
			case 'billed':
			case 'cost':
			case 'paid':
				this[ key ] = Number.parseFloat( value );
				break;
			case 'payments':
				this.payments.push( new Payment( meta ) );
				break;
		}
	}

	protected setRelation( type: CONTENTS_TYPE, relation: Content ): void {
		if ( type === 'appeal' ) {
			this.appeals.push( relation as Appeal );
		} else if ( type === 'call' ) {
			this.calls.push( relation as Call );
		}
		super.setRelation( type, relation );
	}
}
