import {
	Connection,
	EntityManager,
	getConnectionManager,
} from 'typeorm';
import 'reflect-metadata';

import connectionOptions from 'ormconfig';

export async function query(): Promise<EntityManager> {
	return ( await init() ).createEntityManager();
}

export async function getBySlug<T>( entity: string, slug: string ): Promise<T | undefined> {
	const em = await query();
	return em.findOne<T>( entity, { where: { slug } } );
}

async function init( name = 'default' ): Promise<Connection> {
	if ( typeof window !== 'undefined' ) {
		throw new Error( 'Loading SQL in client context' );
	}

	const manager = getConnectionManager();
	if ( ! manager.has( name ) ) {
		const connection = manager.create( connectionOptions );
		if ( ! connection.isConnected ) {
			await connection.connect();
		}
	}
	return manager.get( name );
}

export default init;
