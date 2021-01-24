import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager } from 'typeorm';

class TypeORM extends DataSource {
	private readonly connection: Connection;
	private readonly entityManager: EntityManager;

	constructor( connection: Connection ) {
		super();
		this.connection = connection;
		this.entityManager = connection.createEntityManager();
	}

	get() {
		return this.entityManager;
	}

	get conn() {
		return this.connection;
	}
}

export type dataSources = {
	db: TypeORM;
};

export default function getDataSources( connection: Connection ): Record<string, DataSource> {
	return {
		db: new TypeORM( connection ),
	} as const;
}
