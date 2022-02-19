import { isDate, isObjectLike, toSafeInteger } from 'lodash';

import type {
	GetStaticPaths,
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next';
import type { Knex } from 'knex';
import type {
	GetSinglePageResult,
	Serialized,
	SinglePageProps,
} from 'global-types';
import type { DBCommonFields } from 'lib/db/types';
import type { Entity } from 'lib/entities/types';

export function isSSR(): boolean {
	return typeof window === 'undefined';
}

export function getPageNumber( page: unknown ): number {
	return Math.max( 0, toSafeInteger( page ) );
}

export async function getTotalPageNumber(
	query: Knex.QueryBuilder< DBCommonFields, DBCommonFields[] >,
	pageSize = 20
): Promise< number > {
	const result = await query.count( { count: '*' } ).first();
	const count = toSafeInteger( result?.count );
	return Math.ceil( toSafeInteger( count ) / pageSize );
}

export async function staticPathsFromSlugs(
	slugs: string[],
	prefix: string
): Promise< GetStaticPathsResult > {
	return {
		paths: slugs.map( ( slug ) => `/${ prefix }/${ slug }` ),
		fallback: false,
	};
}

export async function staticPathsEdit(
	root: GetStaticPaths,
	context: GetStaticPathsContext
): Promise< GetStaticPathsResult > {
	const rootStaticPaths = await root( context );
	if ( Array.isArray( rootStaticPaths.paths ) ) {
		rootStaticPaths.paths = rootStaticPaths.paths.map(
			( path ) => `${ path }/edit`
		);
	}
	return rootStaticPaths;
}

export function staticPathsNoData(
	data?: unknown
): GetStaticPathsResult | null {
	if ( ! data ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return null;
}

export async function staticPropsEdit<
	E extends Entity,
	T extends SinglePageProps< E >
>(
	root: GetStaticProps< T >,
	context: GetStaticPropsContext
): GetSinglePageResult< E > {
	const rootProps = await root( context );
	if ( 'props' in rootProps ) {
		rootProps.props.originalTitle = rootProps.props.title;
		rootProps.props.title = `Editing ${ rootProps.props.title }`;
	}
	return rootProps;
}

export function serialize< T >( object: T ): Serialized< T > {
	if ( Array.isArray( object ) ) {
		return object.map( serialize );
	} else if ( isDate( object ) ) {
		return object.toDateString();
	} else if ( isObjectLike( object ) ) {
		for ( const key in object ) {
			object[ key ] = serialize( object[ key ] );
		}
		return object;
	}
	return object;
}
