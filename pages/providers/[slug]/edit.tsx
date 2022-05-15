import React from 'react';

import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
	ProviderWithAdditions,
} from './index';

import type { ActionItem } from 'components/header';
import type { Provider } from 'lib/entities/types';
import type {
	GetSingleEditPageResult,
	GetSinglePageContext,
	SingleEditPageProps,
} from 'pages/types';

export default function ProviderEditPage( {
	record,
}: SingleEditPageProps< Provider > ) {
	const breadcrumbs = [
		{ href: '/providers', name: 'Providers' },
		{ href: `/providers/${ record.slug }`, name: record.name },
		'Edit',
	];
	const actions: ActionItem[] = [
		{
			action: 'Save',
			icon: 'save',
			onClick: () => {},
			disabled: false,
		},
		{
			action: 'Cancel',
			href: `/providers/${ record.slug }`,
			icon: 'cancel',
			color: 'secondary',
		},
	];
	return (
		<Page
			breadcrumbs={ breadcrumbs }
			title={ record.name }
			buttonsBelow
			actions={ actions }
		>
			Hello
		</Page>
	);
}

export function getStaticPaths( context: GetSinglePageContext ) {
	return staticPathsEdit( getRootStaticPaths, context );
}

export function getStaticProps(
	context: GetSinglePageContext
): GetSingleEditPageResult< ProviderWithAdditions > {
	return staticPropsEdit< ProviderWithAdditions >(
		getRootStaticProps,
		context
	);
}
