import Claims, { ClaimsProps } from '../index';

import type { GetStaticPaths, GetStaticProps } from 'next';

const ClaimsPaginated = Claims;

export const getStaticPaths: GetStaticPaths = async () => ( {
	paths: [ 2, 3, 4, 5, 6, 7, 8, 9 ].map( ( page ) => ( {
		params: { page: page + '' },
	} ) ),
	fallback: true,
} );

export const getStaticProps: GetStaticProps<
	ClaimsProps,
	{ page: string }
> = async ( { params } ) => {
	let currentPage = 1;
	if ( params && params.page ) {
		currentPage = Number.parseInt( params.page ) - 1;
	}
	if ( currentPage < 1 ) {
		return {
			redirect: {
				destination: '/claims',
				permanent: true,
			},
		};
	}
	return {
		props: {
			title: 'Claims',
			currentPage,
		},
	};
};

export default ClaimsPaginated;
