import { Box, Container } from '@mui/material';
import type { PageProps } from 'global-types';

type ClaimNewPageProps = PageProps;

const ClaimNewPage: React.FC< ClaimNewPageProps > = () => {
	// TODO: Find way to inherit claim page.
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export async function getStaticProps(): Promise< {
	props: ClaimNewPageProps;
} > {
	return {
		props: {
			title: 'New Claim',
		},
	};
}

export default ClaimNewPage;
