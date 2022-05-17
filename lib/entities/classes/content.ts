/* eslint-disable no-unused-vars */
import Entity from './entity';

import type { ContentDB, MetaDB } from 'lib/db/types';

export default abstract class Content extends Entity {
	public loadFromDB( { identifier, ...row }: ContentDB ) {
		this.slug = identifier;
		return super.loadFromDB( row );
	}

	public loadMeta( meta: MetaDB[] ) {
		for ( const row of meta ) {
			this.setFromMeta( row.key, row.value, row );
		}
		return this;
	}

	protected setFromMeta( key: string, value?: string, meta?: MetaDB ) {}
}
