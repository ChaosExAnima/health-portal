import { EntityManager, MikroORM } from '@mikro-orm/core';
import { DataSource } from 'apollo-datasource';

class MikroAPI extends DataSource {
	private ormPromise: Promise<MikroORM>;
	private orm: MikroORM;

	constructor( orm: Promise<MikroORM> ) {
		super();
		this.ormPromise = orm;
	}

	async initialize(): Promise<void> {
		const orm = await this.ormPromise;
		this.orm = orm;
	}

	get em(): EntityManager {
		return this.orm.em.fork();
	}
}

export default MikroAPI;
