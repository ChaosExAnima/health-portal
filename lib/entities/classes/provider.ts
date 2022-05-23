import { queryNotes } from 'lib/db/helpers';
import { ProviderDB } from 'lib/db/types';

import ContentDBFactory from '../factories/content-db';
import Claim from './claim';
import Entity from './entity';
import Note from './notes';

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

	public async loadNotes(): Promise< this > {
		const notes = await new ContentDBFactory< Note >(
			queryNotes().where( 'providerId', this.id )
		).load();
		this.notes = Array.from( notes );
		return this;
	}
}
