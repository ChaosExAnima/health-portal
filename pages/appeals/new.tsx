import { AppealForm } from 'components/entity-forms';
import Page from 'components/page';

import type { GetPageResult, PageProps } from 'pages/types';

function NewAppealPage( { title }: PageProps ) {
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/appeals', name: 'Appeals' }, title ] }
			maxWidth="sm"
		>
			<AppealForm />
		</Page>
	);
}

export function getStaticProps(): GetPageResult {
	return {
		props: {
			title: 'New appeal',
		},
	};
}

export default NewAppealPage;
