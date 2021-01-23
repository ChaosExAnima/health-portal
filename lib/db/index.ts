import { Connection, createConnection } from 'typeorm';

async function init(): Promise<Connection> {
	if ( typeof window !== 'undefined' ) {
		throw new Error( 'Loading SQL in client context' );
	}
	return createConnection();
}

export default init;
