import { queryNotes } from 'lib/db/helpers';
import { slugify } from 'lib/strings';

import ContentDBFactory from '../factories/content-db';
import Entity from './entity';

import type Claim from './claim';
import type Note from './notes';
import type { ProviderDB } from 'lib/db/types';

export default class Provider extends Entity {
	public name: string;
	public address?: string;
	public phone?: string;
	public email?: string;
	public website?: string;

	public claims: Claim[] = [];
	public notes: Note[] = [];

	public loadFromDB( row: ProviderDB ): this {
		Object.assign( this, row );
		return super.loadFromDB( row );
	}

	public toDB(): ProviderDB {
		return { ...this, slug: slugify( this.name ) };
	}

	public async loadNotes(): Promise< this > {
		const notes = await new ContentDBFactory< Note >(
			queryNotes().where( 'providerId', this.id )
		).load();
		this.notes = Array.from( notes );
		return this;
	}
}
