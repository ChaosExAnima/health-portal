import { queryMeta } from 'lib/db/helpers';

import Appeal from '../classes/appeal';
import Call from '../classes/call';
import Claim from '../classes/claim';
import Content from '../classes/content';
import SavedFile from '../classes/file';
import Note from '../classes/notes';
import DBFactory from './factory-db';

import type { Knex } from 'knex';
import type { ContentDB } from 'lib/db/types';

export default class ContentDBFactory<
	E extends Content
> extends DBFactory< E > {
	protected entities: Map< number, E >;

	public constructor( query: Knex.QueryBuilder< ContentDB > ) {
		super( query );
	}

	/**
	 * Loads meta for all items;
	 * @returns this
	 */
	public async loadMeta(): Promise< this > {
		if ( ! this.length ) {
			return this;
		}
		const meta = await queryMeta( this.ids );
		for ( const row of meta ) {
			const updatedEntity = this.entities.get( row.contentId );
			if ( updatedEntity ) {
				updatedEntity.setMeta( row.key, row.value, row );
				this.entities.set( updatedEntity.id, updatedEntity );
			}
		}
		return this;
	}

	protected newEntity( row: ContentDB ): E {
		let instance: Content;
		switch ( row.type ) {
			case 'appeal':
				instance = new Appeal();
				break;
			case 'call':
				instance = new Call();
				break;
			case 'claim':
				instance = new Claim();
				break;
			case 'file':
				instance = new SavedFile();
				break;
			case 'note':
				instance = new Note();
				break;
			default:
				throw new Error( `Unknown type: ${ row.type }` );
		}
		return instance.loadFromDB( row ) as E;
	}
}
