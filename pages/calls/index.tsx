import { Box, Container } from '@material-ui/core';

import type { PageProps } from 'global-types';

const CallsPage: React.FC<PageProps> = () => {
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
			title: 'Calls',
		},
	};
}

export default CallsPage;
