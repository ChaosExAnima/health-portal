import { Knex } from 'knex';

import { TABLE_IMPORTS } from '../constants';

export async function seed( knex: Knex ): Promise< void > {
	// Deletes ALL existing entries
	await knex( TABLE_IMPORTS ).del();

	// Inserts seed entries
}
