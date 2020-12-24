import { Box, Container } from '@material-ui/core';

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

export async function getStaticProps(): Promise<{ props: PageProps }> {
	return {
		props: {
			title: 'Provider Dr. Steve',
		},
	};
}

export default ProviderPage;
