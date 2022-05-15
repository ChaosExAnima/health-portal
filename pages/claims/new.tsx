import { ClaimForm } from 'components/entity-forms';
import Page from 'components/page';

import type { PageProps } from 'pages/types';

export default function ClaimNewPage( { title }: PageProps ) {
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/claims', name: 'Claims' }, title ] }
			maxWidth="sm"
		>
			<ClaimForm />
		</Page>
	);
}

export async function getStaticProps(): Promise< {
	props: PageProps;
} > {
	return {
		props: {
			title: 'New Claim',
		},
	};
}
