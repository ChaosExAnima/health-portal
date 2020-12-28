import { MikroORM } from '@mikro-orm/core';

export default {
	type: process.env.DB_HOST ? 'mariadb' : 'sqlite',
	dbName: process.env.DB_NAME ?? 'health.db',
	entities: [ './lib/db/entities' ],
	forceUtcTimezone: true,
	forceUndefined: true,
	debug: process.env.DB_DEBUG === 'true',
} as Parameters<typeof MikroORM.init>[0];
