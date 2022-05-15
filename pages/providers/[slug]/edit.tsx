import React from 'react';

import { ProviderForm } from 'components/entity-forms';
import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { ProviderInput } from 'lib/entities/types';
import type {
	GetSingleEditPageResult,
	GetSinglePageContext,
	SingleEditPageProps,
} from 'pages/types';

export default function ProviderEditPage( {
	record,
	originalTitle,
	slug,
}: SingleEditPageProps< ProviderInput > ) {
	return (
		<Page
			breadcrumbs={ [
				{ href: '/providers', name: 'Providers' },
				{ href: `/providers/${ slug }`, name: originalTitle },
				'Edit',
			] }
			title={ originalTitle }
		>
			<ProviderForm saved={ record } />
		</Page>
	);
}

export function getStaticPaths( context: GetSinglePageContext ) {
	return staticPathsEdit( getRootStaticPaths, context );
}

export function getStaticProps(
	context: GetSinglePageContext
): GetSingleEditPageResult< ProviderInput > {
	return staticPropsEdit< ProviderInput >( getRootStaticProps, context );
}
