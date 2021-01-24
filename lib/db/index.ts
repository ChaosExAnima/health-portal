import {
	Connection,
	getConnectionManager,
} from 'typeorm';
import 'reflect-metadata';
import connectionOptions from 'ormconfig';

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
