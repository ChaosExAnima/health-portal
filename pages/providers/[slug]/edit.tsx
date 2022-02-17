import React from 'react';

import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';
import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import type { Provider } from 'lib/entities/types';
import type { HeaderProps } from 'components/header';

const ProviderEditPage: React.FC< SinglePageProps< Provider > > = ( {
	record,
} ) => {
	const breadcrumbs = [
		{ href: '/providers', name: 'Providers' },
		{ href: `/providers/${ record.slug }`, name: record.name },
		'Edit',
	];
	const header: HeaderProps = {
		buttonsBelow: true,
		actions: [
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
		],
	};
	return (
		<Page
			breadcrumbs={ breadcrumbs }
			title={ record.name }
			header={ header }
		>
			Hello
		</Page>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetStaticProps = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export default ProviderEditPage;
