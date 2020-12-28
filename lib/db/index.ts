import { MikroORM } from '@mikro-orm/core';

import config from 'config/db';

async function init(): Promise<MikroORM> {
	if ( typeof window !== 'undefined' ) {
		throw new Error( 'Loading SQL in client context' );
	}

	const orm = await MikroORM.init( config );

	return orm;
}

export default init;
