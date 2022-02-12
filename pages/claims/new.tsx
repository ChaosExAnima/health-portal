import Page from 'components/page';

import type { PageProps } from 'global-types';

type ClaimNewPageProps = PageProps;

function ClaimNewPage( { title }: ClaimNewPageProps ) {
	return <Page title={ title }>Test</Page>;
}

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
