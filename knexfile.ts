import debug from 'debug';
import dotenv from 'dotenv';
import path from 'path';

import type { Knex } from 'knex';

dotenv.config();

const log = debug( 'db' ).extend;
const connection: Knex.Config = {
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASS || 'password',
		database: process.env.DB_DATABASE || 'health',
		port: Number.parseInt( process.env.DB_PORT || '3306', 10 ),
	},
	debug: true,
	// log: {
	// 	warn: log( 'warn' ),
	// 	error: log( 'error' ),
	// 	debug: log( 'debug' ),
	// },
	migrations: {
		directory: path.resolve( __dirname, 'lib/db/migrations' ),
	},
};
export default connection;
