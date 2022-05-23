import { queryProvider } from 'lib/db/helpers';

import ProviderDBFactory from '../factories/provider-db';
import Entity from './entity';
import Provider from './provider';

import type Note from './notes';
import type { CONTENTS_TYPE } from 'lib/constants';
import type { ContentDB, MetaDB } from 'lib/db/types';

export default abstract class Content extends Entity {
	public provider?: Provider;
	public notes: Note[] = [];
	protected readonly contentType: CONTENTS_TYPE;
	protected readonly providerId?: number;
	protected isChanged = false;

	public loadFromDB( { identifier, ...row }: ContentDB ) {
		this.slug = identifier;
		return super.loadFromDB( row );
	}

	// eslint-disable-next-line no-unused-vars
	public setMeta( key: string, value?: string, meta?: MetaDB ) {}

	public setRelations( relations: Content[] ): this {
		for ( const relation of relations ) {
			this.setRelation( relation.contentType, relation );
		}
		return this;
	}

	protected setRelation( type: CONTENTS_TYPE, relation: Content ) {
		if ( type === 'note' ) {
			this.notes.push( relation as Note );
		}
	}

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
