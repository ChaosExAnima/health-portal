import { EntityManager, MikroORM } from '@mikro-orm/core';
import { DataSource } from 'apollo-datasource';

class MikroAPI extends DataSource {
	private orm: MikroORM;

	constructor( orm: MikroORM ) {
		super();
		this.orm = orm;
	}

	get em(): EntityManager {
		return this.orm.em;
	}
}

export default MikroAPI;
