import Content from './content';

import type { CallInput } from '../types';
import type Claim from './claim';
import type { CONTENTS_TYPE } from 'lib/constants';
import type { ContentDB, NewMetaDB } from 'lib/db/types';

export default class Call extends Content {
	public reps: string[] = [];
	public reason: string;
	public result: string;
	public reference?: string;
	public claims: Claim[] = [];

	public loadFromForm( {
		reps,
		reason,
		result,
		reference,
		...input
	}: CallInput ) {
		this.reps = reps ?? [];
		this.reason = reason;
		this.result = result;
		this.reference = reference;
		return super.loadFromForm( input );
	}

	public loadFromDB( row: ContentDB ) {
		this.reason = row.info || '';
		this.result = row.status;
		return super.loadFromDB( row );
	}

	public toMeta(): NewMetaDB[] {
		const reps = this.reps.map( ( rep ) => this.fillMeta( 'reps', rep ) );
		return [ this.fillMeta( 'reference', this.reference ), ...reps ];
	}

	public setMeta( key: string, value?: string ): void {
		if ( key === 'reps' && value ) {
			this.reps.push( value );
		} else if ( key === 'reference' ) {
			this.reference = value ?? '';
		}
	}

	protected setRelation( type: CONTENTS_TYPE, relation: Content ): void {
		if ( type === 'claim' ) {
			this.claims.push( relation as Claim );
		}
		super.setRelation( type, relation );
	}
}
