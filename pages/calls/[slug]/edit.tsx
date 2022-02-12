import { Box, Container } from '@mui/material';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from '.';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';
import type { Call } from 'lib/entities/types';

const CallEditPage: React.FC< SinglePageProps< Call > > = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export const getStaticProps: GetSinglePageProps< Call > = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export default CallEditPage;
