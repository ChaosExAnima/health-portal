import Entity from './entity';

import type { ContentDB, MetaDB } from 'lib/db/types';

export default abstract class Content extends Entity {
	protected isChanged = false;

	public loadFromDB( { identifier, ...row }: ContentDB ) {
		this.slug = identifier;
		return super.loadFromDB( row );
	}

	// eslint-disable-next-line no-unused-vars
	public setMeta( key: string, value?: string, meta?: MetaDB ) {}
}
