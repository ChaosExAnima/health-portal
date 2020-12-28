export default {
	type: process.env.DB_HOST ? 'mariadb' : 'sqlite' as 'mariadb' | 'sqlite',
	dbName: process.env.DB_NAME ?? 'health.db',
	entities: [ './lib/db/entities' ],
	forceUtcTimezone: true,
	forceUndefined: true,
	debug: process.env.DB_DEBUG === 'true',
};
