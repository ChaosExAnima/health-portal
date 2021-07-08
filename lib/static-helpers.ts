import { toSafeInteger } from 'lodash';
import type {
	GetStaticPaths,
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import type { Knex } from 'knex';

import { DBCommonFields } from './db/types';
import { SinglePageProps } from 'global-types';

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

export const staticPathsNoData = (
	data?: unknown
): GetStaticPathsResult | null => {
	if ( ! data ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return null;
};

export function staticPropsSlug< E, T = SinglePageProps >(
	entity: E | undefined,
	props: ( item: E ) => Promise< T >
): GetStaticProps< T > {
	const cb: GetStaticProps< T > = async ( { params } ) => {
		if ( ! params ) {
			return {
				notFound: true,
			};
		}
		if ( ! entity ) {
			return {
				notFound: true,
			};
		}
		return {
			props: await props( entity ),
		};
	};
	return cb;
}

export async function staticPropsEdit<
	T extends SinglePageProps = SinglePageProps
>(
	root: GetStaticProps< T >,
	context: GetStaticPropsContext
): Promise< GetStaticPropsResult< T > > {
	const rootProps = await root( context );
	if ( 'props' in rootProps ) {
		rootProps.props.title = `Editing ${ rootProps.props.title }`;
	}
	return rootProps;
}
