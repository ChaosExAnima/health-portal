import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

import Claims, {
	ClaimsProps,
	getStaticProps as getRootStaticProps,
} from '../index';
import { queryClaims } from 'lib/entities/db';
import { getPageNumber } from 'lib/static-helpers';
import { PaginatedPageContext } from 'global-types';

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryClaims().select( 'identifier' );
	return {
		paths: claims.map( ( { identifier } ) => identifier.toLowerCase() ),
		fallback: false,
	};
}

export async function getStaticProps( {
	params,
}: GetStaticPropsContext< PaginatedPageContext > ): Promise<
	GetStaticPropsResult< ClaimsProps >
> {
	const currentPage = getPageNumber( params?.page );
	if ( currentPage === 1 ) {
		return {
			redirect: {
				destination: '/claims',
				permanent: true,
			},
		};
	}
	return getRootStaticProps( { params } );
}

const ClaimsPaginated = Claims;
export default ClaimsPaginated;
