import { Knex } from 'knex';

import {
	CONTENT_ALL,
	TABLE_CONTENT,
	TABLE_IMPORTS,
	TABLE_META,
	TABLE_PROVIDERS,
	TABLE_RELATIONS,
} from '../constants';
import { ContentDB, ImportDB, MetaDB, ProviderDB, RelationDB } from '../types';

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
		table.string( 'slug' ).notNullable().index();
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
			.index( [ 'type', 'identifier' ] )
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

async function dropForeign< Table extends Record< string, unknown > >(
	knex: Knex,
	tableName: string,
	keys: keyof Table | ( keyof Table )[]
): Promise< void > {
	if ( await knex.schema.hasTable( tableName ) ) {
		await knex.schema.table( tableName, ( table ) => {
			table.dropForeign( keys as string | string[] );
		} );
	}
}

export async function down( knex: Knex ): Promise< void > {
	await dropForeign< ImportDB >( knex, TABLE_IMPORTS, 'fileId' );
	await dropForeign< ProviderDB >( knex, TABLE_PROVIDERS, 'importId' );
	await dropForeign< ContentDB >( knex, TABLE_CONTENT, [
		'providerId',
		'importId',
	] );
	await dropForeign< MetaDB >( knex, TABLE_META, 'contentId' );
	await dropForeign< RelationDB >( knex, TABLE_RELATIONS, [ 'to', 'from' ] );
	await knex.schema.dropTableIfExists( TABLE_CONTENT );
	await knex.schema.dropTableIfExists( TABLE_IMPORTS );
	await knex.schema.dropTableIfExists( TABLE_META );
	await knex.schema.dropTableIfExists( TABLE_PROVIDERS );
	await knex.schema.dropTableIfExists( TABLE_RELATIONS );
}
