import { CallForm } from 'components/entity-forms';
import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { CallInput } from 'lib/entities/types';
import type { GetSinglePageContext, SingleEditPageProps } from 'pages/types';

export default function CallEditPage( {
	record,
	originalTitle,
	slug,
}: SingleEditPageProps< CallInput > ) {
	return (
		<Page
			title={ originalTitle }
			subtitle="Editing"
			breadcrumbs={ [
				{ href: '/calls', name: 'Calls' },
				{ href: `/calls/${ slug }`, name: originalTitle },
				'Editing',
			] }
			maxWidth="sm"
		>
			<CallForm saved={ record } />
		</Page>
	);
}

export function getStaticPaths( context: GetSinglePageContext ) {
	return staticPathsEdit( getRootStaticPaths, context );
}

export function getStaticProps( context: GetSinglePageContext ) {
	return staticPropsEdit( getRootStaticProps, context );
}
