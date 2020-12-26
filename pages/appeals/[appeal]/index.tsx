import { Box, Container } from '@material-ui/core';

import { initializeApollo } from 'lib/apollo';
import { AppealsSlugsDocument, AppealsSlugsQuery } from 'lib/apollo/queries/appeals.graphql';
import { staticPathsNoData } from 'lib/static-helpers';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { PageProps } from 'global-types';

const AppealPage: React.FC<PageProps> = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				Hello
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const client = initializeApollo();
	const { data } = await client.query<AppealsSlugsQuery>( { query: AppealsSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getAppeals.appeals.map( ( appeal ) => appeal && `/appeals/${ appeal.slug }` ),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
	return {
		props: {
			title: 'Appeal on 1/1/2020',
		},
	};
};

export default AppealPage;
