import { ProviderForm } from 'components/entity-forms';
import Page from 'components/page';

import type { GetPageResult, PageProps } from 'pages/types';

export default function NewProviderPage( { title }: PageProps ) {
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/providers', name: 'Providers' }, title ] }
			maxWidth="sm"
		>
			<ProviderForm />
		</Page>
	);
}

export function getStaticProps(): GetPageResult {
	return {
		props: {
			title: 'New provider',
		},
	};
}
