import Claims, { ClaimsProps } from '../index';

import type { GetStaticPaths, GetStaticProps } from 'next';

const ClaimsPaginated = Claims;

export const getStaticPaths: GetStaticPaths = async () => ( {
	paths: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map( ( page ) => ( {
		params: { page: page + '' },
	} ) ),
	fallback: true,
} );

export const getStaticProps: GetStaticProps<ClaimsProps, { page: string }> = async ( { params } ) => {
	let currentPage = 1;
	if ( params && params.page ) {
		currentPage = Number.parseInt( params.page );
	}
	return {
		props: {
			title: 'Claims',
			totalClaims: 1043,
			currentPage,
			rows: [
				{
					id: 1,
					claim: '202933847338490',
					date: new Date( 2020, 1, 23 ).getTime(),
					provider: 'Dr. Jane Smith',
					type: 'in network',
					billed: 500,
					cost: 15,
					status: 'approved',
				},
				{
					id: 2,
					claim: '2020336DV3604',
					date: new Date( 2020, 4, 34 ).getTime(),
					provider: 'Dr. Jane Smith',
					type: 'in network',
					billed: 340,
					cost: 10.55,
					status: 'pending',
				},
			],
		},
	};
};

export default ClaimsPaginated;
