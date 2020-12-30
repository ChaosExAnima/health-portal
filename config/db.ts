import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';

dotenv.config();

import * as entities from '../lib/db/entities';

const type = process.env.DB_TYPE;
let connection: Parameters<typeof MikroORM.init>[0];
if ( type === 'mariadb' || type === 'mysql' ) {
	connection = {
		type,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? Number.parseInt( process.env.DB_PORT ) : undefined,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		dbName: process.env.DB_NAME,
	};
} else {
	connection = {
		type: 'sqlite',
		dbName: process.env.DB_NAME ?? 'health.db',
	};
}

export default {
	...connection,
	entities: Object.values( entities ),
	forceUtcTimezone: true,
	forceUndefined: true,
	debug: process.env.DB_DEBUG === 'true',
	discovery: { disableDynamicFileAccess: true },
} as Parameters<typeof MikroORM.init>[0];
