import dotenv from 'dotenv';
dotenv.config();

import debug from 'debug';
import path from 'path';

import type { Knex } from 'knex';

const log = debug( 'db' );
const connection: Knex.Config = {
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASS || 'password',
		database: process.env.DB_DATABASE || 'health',
		port: Number.parseInt( process.env.DB_PORT || '3306', 10 ),
	},
	debug: process.env.NODE_ENV !== 'production',
	log: {
		warn: log.extend( 'warn' ),
		error: log.extend( 'error' ),
		debug: log.extend( 'debug' ),
		deprecate: log.extend( 'deprecate' ),
	},
	migrations: {
		directory: path.resolve( __dirname, 'lib/db/migrations' ),
	},
	seeds: {
		directory: path.resolve( __dirname, 'lib/db/seeds' ),
	},
};
export default connection;
