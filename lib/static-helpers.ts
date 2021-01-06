import { EntityName } from '@mikro-orm/core';
import initDb from 'lib/db';

import type { GetStaticPathsResult } from 'next';
import type BaseSlugEntity from './db/entities/slug';

export function isSSR(): boolean {
	return typeof window === 'undefined';
}

export async function staticPathsFromSlugs( entity: EntityName<BaseSlugEntity>, prefix: string ): Promise<GetStaticPathsResult> {
	const db = await initDb();
	const objects = await db.em.find( entity, {}, { fields: [ 'slug' ] } );
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

export const staticPathsNoData = ( data?: unknown ): GetStaticPathsResult | null => {
	if ( ! data ) {
		return {
			paths: [],
			fallback: true,
		};
	}
	return null;
};
