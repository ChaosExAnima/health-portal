import Appeal from '../classes/appeal';
import Call from '../classes/call';
import Claim from '../classes/claim';
import Content from '../classes/content';
import SavedFile from '../classes/file';
import Note from '../classes/notes';
import Factory from './factory';

import type { Knex } from 'knex';
import type { ContentDB } from 'lib/db/types';

export default class ContentDBFactory extends Factory {
	protected entities: Content[];
	protected query: Knex.QueryBuilder< ContentDB, ContentDB[] >;

	public constructor( query: Knex.QueryBuilder< ContentDB > ) {
		super();
		this.query = query;
	}

	public async load() {
		const results = await this.query;
		this.entities = results.map( this.newEntity );
		return this;
	}

	protected newEntity( row: ContentDB ): Content {
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
		return instance.loadFromDB( row );
	}
}
