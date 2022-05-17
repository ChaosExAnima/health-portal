import { ContentDB, MetaDB } from 'lib/db/types';

import { CallInput } from '../types';
import Content from './content';

export default class Call extends Content {
	public reps: string[] = [];
	public reason: string;
	public result: string;
	public reference?: string;

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

	public loadMeta( meta: MetaDB[] ) {
		for ( const { key, value } of meta ) {
			if ( key === 'reps' ) {
				this.reps = value?.split( ',' ) ?? [];
			} else if ( key === 'reference' ) {
				this.reference = value ?? '';
			}
		}
		return super.loadMeta( meta );
	}
}
