import { AppealForm } from 'components/entity-forms';
import Page from 'components/page';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { Appeal } from 'lib/entities/types';
import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SingleEditPageProps } from 'pages/types';

export default function AppealEditPage( {
	originalTitle,
	record,
	slug,
}: SingleEditPageProps< Appeal > ) {
	return (
		<Page
			title={ originalTitle }
			subtitle="Editing"
			breadcrumbs={ [
				{ href: '/appeals', name: 'Appeals' },
				{ href: `/appeals/${ slug }`, name: originalTitle },
				'Editing',
			] }
		>
			<AppealForm saved={ record } />
		</Page>
	);
}

export const getStaticProps: GetSinglePageProps< Appeal > = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );
