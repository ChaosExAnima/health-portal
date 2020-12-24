import { Box, Container } from '@material-ui/core';

import type { PageProps } from 'global-types';

const NewProviderPage: React.FC<PageProps> = () => {
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
			title: 'New provider',
		},
	};
}

export default NewProviderPage;
