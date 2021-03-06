import { Box, Container } from '@material-ui/core';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from '.';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

const CallEditPage: React.FC< SinglePageProps > = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export const getStaticProps: GetStaticProps< SinglePageProps > = async (
	context
) => staticPropsEdit( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export default CallEditPage;
