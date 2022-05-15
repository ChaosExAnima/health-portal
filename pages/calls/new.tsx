import CallForm from 'components/entity-forms/call';
import Page from 'components/page';

import type { GetPageResult, PageProps } from 'pages/types';

export default function NewCallPage( { title }: PageProps ) {
	return (
		<Page
			title={ title }
			maxWidth="sm"
			breadcrumbs={ [ { href: '/calls', name: 'Calls' }, title ] }
		>
			<CallForm />
		</Page>
	);
}

export function getStaticProps(): GetPageResult {
	return {
		props: {
			title: 'New call',
		},
	};
}
