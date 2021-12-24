import { Knex } from 'knex';

import { TABLE_CONTENT } from '../../constants';

export async function up( knex: Knex ): Promise< void > {
	await knex.schema.table( TABLE_CONTENT, ( table ) => {
		table.dropColumn( 'importId' );
	} );
}

export async function down( knex: Knex ): Promise< void > {
	await knex.schema.table( TABLE_CONTENT, ( table ) => {
		table.integer( 'importId', 10 ).unsigned().nullable().index();
	} );
}
