import { ConnectionOptions } from 'typeorm';

export default {
	type: 'mariadb',
	host: process.env.DB_HOST || 'localhost',
	username: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || 'password',
	database: process.env.DB_DATABASE || 'health',
	port: process.env.DB_PORT || 3306,
	logging: process.env.DEBUG || false,
	entities: [ 'lib/db/entities/*.ts' ],
	cli: {
		entitiesDir: 'lib/db/entities',
	},
} as ConnectionOptions;

