import { EntityManager, MikroORM } from '@mikro-orm/core';
import { DataSource } from 'apollo-datasource';

class MikroAPI extends DataSource {
	private ormPromise: Promise<MikroORM>;
	private orm: MikroORM;

	constructor( orm: Promise<MikroORM> | MikroORM ) {
		super();
		this.ormPromise = Promise.resolve( orm );
	}

	async initialize(): Promise<void> {
		const orm = await this.ormPromise;
		this.orm = orm;
	}

	get em(): EntityManager {
		return this.orm.em;
	}
}

export default MikroAPI;
