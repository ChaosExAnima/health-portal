import { Box, Container } from '@material-ui/core';

import { CallsSlugsDocument, CallsSlugsQuery } from 'lib/apollo/queries/calls.graphql';
import { initializeApollo } from 'lib/apollo';
import { staticPathsNoData } from 'lib/static-helpers';

import type { GetStaticPaths } from 'next';
import type { PageProps } from 'global-types';

const CallPage: React.FC<PageProps> = () => {
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
	const { data } = await client.query<CallsSlugsQuery>( { query: CallsSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getCalls.calls.map( ( call ) => call && `/calls/${ call.slug }` ),
		fallback: true,
	};
};

export async function getStaticProps(): Promise<{ props: PageProps }> {
	return {
		props: {
			title: 'Call on 1/1/2020',
		},
	};
}

export default CallPage;
