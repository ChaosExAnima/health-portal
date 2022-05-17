import { ContentDB, MetaDB } from 'lib/db/types';

import Entity from './entity';

export default abstract class Content extends Entity {
	public loadFromDB( { identifier, ...row }: ContentDB ) {
		this.slug = identifier;
		return super.loadFromDB( row );
	}

	public loadMeta( meta: MetaDB[] ) {
		for ( const row of meta ) {
			this.setFromMeta( row.key, row.value );
		}
		return this;
	}

	// eslint-disable-next-line no-unused-vars
	protected setFromMeta( key: string, value: any ) {}
}
