import { queryProvider } from 'lib/db/helpers';

import ProviderDBFactory from '../factories/provider-db';
import Entity from './entity';
import Provider from './provider';

import type Note from './notes';
import type { CONTENTS_TYPE } from 'lib/constants';
import type { ContentDB, MetaDB, NewMetaDB } from 'lib/db/types';

export default abstract class Content extends Entity {
	public provider?: Provider;
	public notes: Note[] = [];
	public slug: string;
	public isChanged = false;

	protected contentType: CONTENTS_TYPE;
	protected contentStatus: string;
	protected contentInfo?: string;
	protected providerId?: number;

	public loadFromDB( {
		identifier,
		info,
		providerId,
		status,
		type,
		...row
	}: ContentDB ) {
		this.slug = identifier;
		this.contentInfo = info;
		this.providerId = providerId;
		this.contentStatus = status;
		this.contentType = type;
		return super.loadFromDB( row );
	}

	public toDB(): ContentDB {
		return {
			id: this.id,
			created: this.created,
			identifier: this.slug,
			info: this.contentInfo,
			type: this.contentType,
			status: this.contentStatus,
			providerId: this.providerId,
		};
	}

	// eslint-disable-next-line no-unused-vars
	public setMeta( key: string, value?: string, meta?: MetaDB ) {}

	public toMeta(): NewMetaDB[] {
		return [];
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

	protected fillMeta< M extends Record< string, any > >(
		key: string,
		value?: string,
		meta?: M
	): NewMetaDB< M > {
		return {
			id: 0,
			created: undefined,
			contentId: this.id,
			key,
			value,
			meta: meta ?? {},
		};
	}

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
}
