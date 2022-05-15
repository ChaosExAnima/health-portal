import { ClaimForm } from 'components/entity-forms';
import Page from 'components/page';
import { ClaimInput } from 'lib/entities/types';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SingleEditPageProps } from 'pages/types';

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

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetSinglePageProps< ClaimInput > = async (
	context
) => staticPropsEdit( getRootStaticProps, context );
