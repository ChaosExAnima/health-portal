import { Knex } from 'knex';

import {
	CONTENT_ALL,
	TABLE_CONTENT,
	TABLE_IMPORTS,
	TABLE_META,
	TABLE_PROVIDERS,
	TABLE_RELATIONS,
} from '../constants';

export async function up( knex: Knex ): Promise< void > {
	const addCreated = ( table: Knex.TableBuilder ): void => {
		table.dateTime( 'created' ).defaultTo( knex.fn.now() );
	};
	const addRef = (
		table: Knex.TableBuilder,
		name: string,
		refTable?: string,
		refColumn = 'id'
	): Knex.ColumnBuilder => {
		let column = table.integer( name, 10 ).unsigned();
		if ( refTable && refColumn ) {
			column = column
				.references( refColumn )
				.inTable( refTable )
				.onDelete( 'CASCADE' )
				.onUpdate( 'CASCADE' );
		}
		return column;
	};

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
		table.string( 'string' ).notNullable().index();
		table.string( 'name' ).notNullable();
		table.string( 'phone' );
		table.text( 'address' );
		table.string( 'website' );
		table.string( 'email' );
		addRef( table, 'importId', TABLE_IMPORTS ).nullable().index();
	} );

	await knex.schema.createTable( TABLE_CONTENT, ( table ) => {
		table.increments();
		addCreated( table );
		table.string( 'identifier' ).notNullable().defaultTo( '' );
		table.enum( 'type', CONTENT_ALL ).notNullable();
		table.text( 'info' ).nullable();
		table.string( 'status' ).nullable().index();
		addRef( table, 'providerId', TABLE_PROVIDERS ).nullable().index();
		addRef( table, 'importId', TABLE_IMPORTS ).nullable().index();

		table
			.index( [ 'identifier', 'type' ] )
			.comment( 'Should use to query types.' );
	} );

	await knex.schema.table( TABLE_IMPORTS, ( table ) => {
		table
			.foreign( 'fileId' )
			.references( 'id' )
			.inTable( TABLE_CONTENT )
			.onDelete( 'SET NULL' );
	} );

	await knex.schema.createTable( TABLE_META, ( table ) => {
		table.increments();
		addCreated( table );
		addRef( table, 'contentId', TABLE_CONTENT ).notNullable().index();
		table.string( 'key', 100 ).notNullable();
		table.string( 'value' );
		table.json( 'meta' );

		table.index( [ 'key', 'value' ] );
	} );

	await knex.schema.createTable( TABLE_RELATIONS, ( table ) => {
		table.increments();
		addCreated( table );
		addRef( table, 'from', TABLE_CONTENT ).notNullable();
		addRef( table, 'to', TABLE_CONTENT ).notNullable();
		table.json( 'meta' );

		table
			.index( [ 'from', 'to' ] )
			.comment( 'Get links for parent and child' );
	} );
}

export async function down( { schema }: Knex ): Promise< void > {
	await schema.dropTableIfExists( TABLE_CONTENT );
	await schema.dropTableIfExists( TABLE_IMPORTS );
	await schema.dropTableIfExists( TABLE_META );
	await schema.dropTableIfExists( TABLE_PROVIDERS );
	await schema.dropTableIfExists( TABLE_RELATIONS );
}
