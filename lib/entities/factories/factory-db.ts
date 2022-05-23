import Factory from './factory';

import type Entity from '../classes/entity';
import type { Knex } from 'knex';
import type { DBCommonFields } from 'lib/db/types';

export default abstract class DBFactory<
	E extends Entity
> extends Factory< E > {
	protected query: Knex.QueryBuilder< DBCommonFields, DBCommonFields[] >;

	public constructor( query: Knex.QueryBuilder< DBCommonFields > ) {
		super();
		this.query = query;
	}

	public async load() {
		const rows = await this.query;
		for ( const row of rows ) {
			this.entities.set( row.id, this.newEntity( row ) );
		}
		return this;
	}

	// eslint-disable-next-line no-unused-vars
	protected abstract newEntity( row: DBCommonFields ): E;
}
