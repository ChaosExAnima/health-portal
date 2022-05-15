import { ClaimForm } from 'components/entity-forms';
import Page from 'components/page';
import { ClaimInput } from 'lib/entities/types';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type {
	GetSingleEditPageResult,
	GetSinglePageContext,
	SingleEditPageProps,
} from 'pages/types';

export default function ClaimPageEdit( {
	originalTitle,
	record,
	slug,
}: SingleEditPageProps< ClaimInput > ) {
	return (
		<Page
			title={ originalTitle }
			subtitle="Editing"
			breadcrumbs={ [
				{ href: '/claims', name: 'Claims' },
				{ href: `/claims/${ slug }`, name: originalTitle },
				'Editing',
			] }
			maxWidth="sm"
		>
			<ClaimForm saved={ record } />
		</Page>
	);
}

export function getStaticPaths( context: GetSinglePageContext ) {
	return staticPathsEdit( getRootStaticPaths, context );
}

export function getStaticProps(
	context: GetSinglePageContext
): GetSingleEditPageResult< ClaimInput > {
	return staticPropsEdit( getRootStaticProps, context );
}
