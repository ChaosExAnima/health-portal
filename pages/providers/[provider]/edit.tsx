import { Box, Container } from '@material-ui/core';

import { getStaticPaths as getRootStaticPaths } from '.';

import type { GetStaticPaths } from 'next';
import type { PageProps } from 'global-types';

const ProviderEditPage: React.FC<PageProps> = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				Hello
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) => {
	const rootStaticPaths = await getRootStaticPaths( context );
	if ( Array.isArray( rootStaticPaths.paths ) ) {
		rootStaticPaths.paths = rootStaticPaths.paths.map( ( path ) => `${ path }/edit` );
	}
	return rootStaticPaths;
};

export async function getStaticProps(): Promise<{ props: PageProps }> {
	return {
		props: {
			title: 'Editing Dr. Steve',
		},
	};
}

export default ProviderEditPage;
