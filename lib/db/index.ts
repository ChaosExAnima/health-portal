import { MikroORM } from '@mikro-orm/core';

import config from '../../config/db';

let cache: MikroORM | null = null;

async function init(): Promise<MikroORM> {
	if ( typeof window !== 'undefined' ) {
		throw new Error( 'Loading SQL in client context' );
	}

	const orm = cache || await MikroORM.init( config );
	if ( ! cache ) {
		cache = orm;
	}

	return orm;
}

export default init;
