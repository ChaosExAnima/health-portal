import {
	Connection,
	createConnection,
	EntityManager,
	getConnection,
} from 'typeorm';
import * as entities from 'lib/db/entities';

export function getEntityManager(): EntityManager {
	return getConnection( 'test' ).createEntityManager();
}

export function createTestDB(): Promise< Connection > {
	return createConnection( {
		name: 'test',
		type: 'sqlite',
		database: ':memory:',
		dropSchema: true,
		entities: [ ...Object.values( entities ) ],
		synchronize: true,
		logging: false,
	} );
}

export function resetTestDB(): Promise< void > {
	const conn = getConnection( 'test' );
	return conn.close();
}
