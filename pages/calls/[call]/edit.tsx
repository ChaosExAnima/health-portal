import { Box, Container } from '@material-ui/core';

import { getStaticPaths as getRootStaticPaths } from '.';

import type { GetStaticPaths } from 'next';
import type { PageProps } from 'global-types';

const CallEditPage: React.FC<PageProps> = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				Hello
			</Box>
		</Container>
	);
};

export async function getStaticProps(): Promise<{ props: PageProps }> {
	return {
		props: {
			title: 'Editing call on 1/1/2020',
		},
	};
}

export const getStaticPaths: GetStaticPaths = async ( context ) => {
	const rootStaticPaths = await getRootStaticPaths( context );
	if ( Array.isArray( rootStaticPaths.paths ) ) {
		rootStaticPaths.paths = rootStaticPaths.paths.map( ( path ) => `${ path }/edit` );
	}
	return rootStaticPaths;
};

export default CallEditPage;
