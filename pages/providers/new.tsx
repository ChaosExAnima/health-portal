import { ProviderForm } from 'components/entity-forms';
import Page from 'components/page';
import { GetStaticPropsResult } from 'next';

import type { PageProps } from 'pages/types';

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

export function getStaticProps(): GetStaticPropsResult< PageProps > {
	return {
		props: {
			title: 'New provider',
		},
	};
}
