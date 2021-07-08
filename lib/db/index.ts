import knex, { Knex } from 'knex';

import knexConfig from 'knexfile';

export default function getDB(): Knex {
	return knex( knexConfig );
}
