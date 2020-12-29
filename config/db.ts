import { MikroORM } from '@mikro-orm/core';

import * as entities from '../lib/db/entities';

export default {
	type: process.env.DB_HOST ? 'mariadb' : 'sqlite',
	dbName: process.env.DB_NAME ?? 'health.db',
	entities: Object.values( entities ),
	forceUtcTimezone: true,
	forceUndefined: true,
	debug: process.env.DB_DEBUG === 'true',
	discovery: { disableDynamicFileAccess: true },
} as Parameters<typeof MikroORM.init>[0];
