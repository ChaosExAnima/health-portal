import { ClaimForm } from 'components/entity-forms';
import Page from 'components/page';

import type { GetPageResult, PageProps } from 'pages/types';

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

export function getStaticProps(): GetPageResult {
	return {
		props: {
			title: 'New Claim',
		},
	};
}
