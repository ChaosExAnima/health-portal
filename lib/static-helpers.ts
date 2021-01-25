import { SinglePageProps } from 'global-types';
import initDb, { getBySlug } from 'lib/db';

import type {
	GetStaticPaths,
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

export function isSSR(): boolean {
	return typeof window === 'undefined';
}

export async function staticPathsFromSlugs(
	entity: string,
	prefix: string,
): Promise<GetStaticPathsResult> {
	const db = await initDb();
	const objects = await db.createEntityManager().find( entity, { select: [ 'slug' ] } );
	if ( ! objects.length ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return {
		paths: objects.map( ( { slug } ) => `/${ prefix }/${ slug }` ),
		fallback: true,
	};
}

export async function staticPathsEdit(
	root: GetStaticPaths,
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> {
	const rootStaticPaths = await root( context );
	if ( Array.isArray( rootStaticPaths.paths ) ) {
		rootStaticPaths.paths = rootStaticPaths.paths.map( ( path ) => `${ path }/edit` );
	}
	return rootStaticPaths;
}

export const staticPathsNoData = ( data?: unknown ): GetStaticPathsResult | null => {
	if ( ! data ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return null;
};

export function staticPropsSlug<E, T = SinglePageProps>(
	entity: string,
	props: ( item: E ) => T,
): GetStaticProps<T> {
	const cb: GetStaticProps<T> = async ( { params } ) => {
		if ( ! params ) {
			return {
				notFound: true,
			};
		}
		const item = await getBySlug<E>( entity, params );
		if ( ! item ) {
			return {
				notFound: true,
			};
		}
		return {
			props: props( item ),
		};
	};
	return cb;
}

export async function staticPropsEdit<T extends SinglePageProps = SinglePageProps>(
	root: GetStaticProps<T>,
	context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<T>> {
	const rootProps = await root( context );
	if ( 'props' in rootProps ) {
		rootProps.props.title = `Editing ${ rootProps.props.title }`;
	}
	return rootProps;
}
