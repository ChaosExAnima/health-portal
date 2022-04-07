import { toSafeInteger } from 'lodash';

import type {
	GetStaticPaths,
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next';
import type { Knex } from 'knex';
import type { GetSingleEditPageResult, SinglePageProps } from 'pages/types';
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

export async function staticPropsEdit< E extends Entity >(
	root: GetStaticProps< SinglePageProps< E > >,
	context: GetStaticPropsContext
): GetSingleEditPageResult< E > {
	const rootProps = await root( context );
	if ( ! ( 'props' in rootProps ) ) {
		return rootProps;
	}
	return {
		...rootProps,
		props: {
			...rootProps.props,
			originalTitle: rootProps.props.title,
			title: `Editing ${ rootProps.props.title }`,
			record: rootProps.props.record,
		},
	};
}
