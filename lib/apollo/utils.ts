import debug from 'debug';

import type { DeepPartial } from 'typeorm';
import type { TypeORM } from 'lib/apollo/datasources';
import type { MutationResponse } from 'lib/apollo/schema/index.graphqls';
import type BaseSlugEntity from 'lib/db/entities/slug';

export const log = debug( 'apollo' );

export function removeNull< TValue >(
	value: TValue | null | undefined
): value is TValue {
	return value !== null && value !== undefined;
}

export function slugToPath(
	link: { __typename?: string; slug?: string | null } | undefined | null
): string | null {
	return ( link && typeToPath( link.__typename, link.slug ) ) || null;
}

export function typeToPath( type?: string, slug?: string | null ): string {
	switch ( type ) {
		case 'Call':
			return `/calls/${ slug }`;
		case 'Claim':
			return `/claims/${ slug }`;
		case 'Appeal':
			return `/appeals/${ slug }`;
		case 'Provider':
			return `/providers/${ slug }`;
		default:
			return '';
	}
}

export function removeChars(
	input: Record< string, unknown >,
	chars: Array< unknown >
): Record< string, unknown > {
	const output: Record< string, unknown > = {};
	for ( const key in input ) {
		output[ key ] = chars.includes( input[ key ] )
			? undefined
			: input[ key ];
	}
	return output;
}

export function mutationResponse( error?: unknown ): MutationResponse {
	if ( error ) {
		let msg = 'Unknown error';
		if ( error instanceof Error ) {
			msg = error.message;
			log( error );
		}
		return {
			code: msg,
			success: false,
		};
	}
	return {
		code: 'Success',
		success: true,
	};
}

export async function editAndSave< Entity extends BaseSlugEntity >(
	entity: string,
	db: TypeORM,
	entityProps: DeepPartial< Entity >
): Promise< Entity > {
	const repo = db.repo< Entity >( entity );
	let currentEntity: Entity | undefined;

	if ( entityProps.slug ) {
		currentEntity = await repo.findOne( undefined, {
			select: [ 'id', 'slug' ],
			where: { slug: entityProps.slug },
		} );
	}

	if ( currentEntity ) {
		await repo.update( currentEntity.id, entityProps );
		return currentEntity;
	}

	const newEntity = repo.create( entityProps );
	await repo.insert( newEntity );
	return newEntity;
}
