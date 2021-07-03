import { Knex } from 'knex';

import {
	CONTENT_ALL,
	TABLE_CONTENT,
	TABLE_IMPORTS,
	TABLE_META,
	TABLE_PROVIDERS,
	TABLE_RELATIONS,
} from 'lib/constants';

export async function up( knex: Knex ): Promise< void > {
	const addCreated = ( table: Knex.TableBuilder ): Knex.ColumnBuilder =>
		table.dateTime( 'created' ).defaultTo( knex.fn.now() );
	const addRef = (
		table: Knex.TableBuilder,
		name: string
	): Knex.ColumnBuilder => table.integer( name, 10 ).unsigned();

	await knex.schema.createTable( TABLE_IMPORTS, ( table ) => {
		table.increments();
		addCreated( table );
		table.string( 'hash' ).notNullable().index();
		table.integer( 'inserted' ).unsigned();
		table.integer( 'updated' ).unsigned();
		addRef( table, 'fileId' ).nullable().index();
	} );

	await knex.schema.createTable( TABLE_PROVIDERS, ( table ) => {
		table.increments();
		addCreated( table );
		table.string( 'slug' ).notNullable().index();
		table.string( 'name' ).notNullable();
		table.string( 'phone' );
		table.text( 'address' );
		table.string( 'website' );
		table.string( 'email' );
		addRef( table, 'importId' ).nullable().index();
	} );

	await knex.schema.createTable( TABLE_CONTENT, ( table ) => {
		table.increments();
		addCreated( table );
		table.string( 'identifier' ).notNullable().defaultTo( '' );
		table.enum( 'type', CONTENT_ALL ).notNullable();
		table.text( 'info' ).nullable();
		table.string( 'status' ).nullable().index();
		addRef( table, 'providerId' ).nullable().index();
		addRef( table, 'importId' ).nullable().index();

		table
			.index( [ 'type', 'identifier' ] )
			.comment( 'Should use to query types.' );
	} );

	await knex.schema.createTable( TABLE_META, ( table ) => {
		table.increments();
		addCreated( table );
		addRef( table, 'contentId' ).notNullable().index();
		table.string( 'key', 100 ).notNullable();
		table.string( 'value' );
		table.json( 'meta' );

		table.index( [ 'key', 'value' ] );
	} );

	await knex.schema.createTable( TABLE_RELATIONS, ( table ) => {
		table.increments();
		addCreated( table );
		addRef( table, 'from' ).notNullable();
		addRef( table, 'to' ).notNullable();
		table.json( 'meta' );

		table
			.index( [ 'from', 'to' ] )
			.comment( 'Get links for parent and child' );
	} );
}

export async function down( knex: Knex ): Promise< void > {
	await knex.schema.dropTableIfExists( TABLE_CONTENT );
	await knex.schema.dropTableIfExists( TABLE_IMPORTS );
	await knex.schema.dropTableIfExists( TABLE_META );
	await knex.schema.dropTableIfExists( TABLE_PROVIDERS );
	await knex.schema.dropTableIfExists( TABLE_RELATIONS );
}
