import { queryProvider } from 'lib/db/helpers';

import ProviderDBFactory from '../factories/provider-db';
import Entity from './entity';
import Provider from './provider';

import type { ContentDB, MetaDB } from 'lib/db/types';

export default abstract class Content extends Entity {
	public provider?: Provider;
	protected providerId?: number;
	protected isChanged = false;

	public loadFromDB( { identifier, ...row }: ContentDB ) {
		this.slug = identifier;
		return super.loadFromDB( row );
	}

	// eslint-disable-next-line no-unused-vars
	public setMeta( key: string, value?: string, meta?: MetaDB ) {}

	public async loadProvider(): Promise< this > {
		if ( this.providerId ) {
			const providers = await new ProviderDBFactory(
				queryProvider( this.providerId )
			).load();
			this.provider = providers.first();
		}
		return this;
	}
}
