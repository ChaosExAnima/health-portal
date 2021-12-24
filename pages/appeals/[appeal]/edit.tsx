import { Box, Container } from '@material-ui/core';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from '.';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';
import { Appeal } from 'lib/entities/types';

const AppealEditPage: React.FC< SinglePageProps< Appeal > > = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export const getStaticProps: GetStaticProps<
	SinglePageProps< Appeal >,
	{ appeal: string }
> = async ( context ) =>
	staticPropsEdit< SinglePageProps< Appeal > >( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export default AppealEditPage;
