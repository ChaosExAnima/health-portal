import path from 'path';
import { ConnectionOptions } from 'typeorm';

import * as entities from './lib/db/entities';

export default {
	type: 'mariadb',
	host: process.env.DB_HOST || 'localhost',
	username: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || 'password',
	database: process.env.DB_DATABASE || 'health',
	port: process.env.DB_PORT || 3306,
	logging: process.env.DEBUG ? 'all' : false,
	entities: [ ...Object.values( entities ) ],
	cli: {
		entitiesDir: path.resolve( process.cwd(), 'lib/db/entities' ),
	},
} as ConnectionOptions;
