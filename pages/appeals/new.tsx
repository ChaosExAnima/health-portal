import { Box, Container } from '@mui/material';

import type { PageProps } from 'pages/types';

const NewAppealPage: React.FC< PageProps > = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export async function getStaticProps(): Promise< { props: PageProps } > {
	return {
		props: {
			title: 'New appeal',
		},
	};
}

export default NewAppealPage;
