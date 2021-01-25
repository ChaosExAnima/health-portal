import {
	Connection,
	EntityManager,
	getConnectionManager,
} from 'typeorm';
import 'reflect-metadata';

import connectionOptions from 'ormconfig';

import type { ParsedUrlQuery } from 'querystring';

export async function query(): Promise<EntityManager> {
	return ( await init() ).createEntityManager();
}

export async function getBySlug<T>( entity: string, params: ParsedUrlQuery ): Promise<T | undefined> {
	const em = await query();
	const { slug } = params;
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
