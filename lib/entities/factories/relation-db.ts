import { queryRelated } from 'lib/db/helpers';

import ContentDBFactory from './content-db';

import type Content from '../classes/content';
import type { Knex } from 'knex';
import type { LoadedRelationDB } from 'lib/db/types';

export default class RelationDBFactory extends ContentDBFactory<
	Content,
	LoadedRelationDB
> {
	protected query: Knex.QueryBuilder< LoadedRelationDB, LoadedRelationDB[] >;
	protected relations = new Map< number, Content[] >();

	public constructor( ids: number[] ) {
		super( queryRelated( ids ) );
	}

	public async load(): Promise< this > {
		const rows = await this.query;
		for ( const row of rows ) {
			this.relations.set( row.from, [
				...( this.relations.get( row.from ) ?? [] ),
				this.newEntity( row ),
			] );
			this.entities.set( row.id, this.newEntity( row ) );
		}
		return this;
	}

	public entries() {
		return this.relations.entries();
	}
}
