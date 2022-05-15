import { CallForm } from 'components/entity-forms';
import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { CallInput } from 'lib/entities/types';
import type { GetStaticPathsResult } from 'next';
import type {
	GetSingleEditPageResult,
	GetSinglePageContext,
	SingleEditPageProps,
} from 'pages/types';

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

export async function getStaticPaths(
	context: GetSinglePageContext
): Promise< GetStaticPathsResult > {
	return staticPathsEdit( getRootStaticPaths, context );
}

export async function getStaticProps(
	context: GetSinglePageContext
): GetSingleEditPageResult< CallInput > {
	return staticPropsEdit< CallInput >( getRootStaticProps, context );
}
