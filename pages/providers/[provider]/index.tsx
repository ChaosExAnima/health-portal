import { Box, Container } from '@material-ui/core';

import { initializeApollo } from 'lib/apollo';
import { ProvidersSlugsDocument, ProvidersSlugsQuery } from 'lib/apollo/queries/providers.graphql';
import { staticPathsNoData } from 'lib/static-helpers';

import type { GetStaticPaths } from 'next';
import type { PageProps } from 'global-types';

const ProviderPage: React.FC<PageProps> = () => {
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
	const { data } = await client.query<ProvidersSlugsQuery>( { query: ProvidersSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getProviders.providers.map( ( provider ) => provider && `/providers/${ provider.slug }` ),
		fallback: true,
	};
};

export async function getStaticProps(): Promise<{ props: PageProps }> {
	return {
		props: {
			title: 'Provider Dr. Steve',
		},
	};
}

export default ProviderPage;
