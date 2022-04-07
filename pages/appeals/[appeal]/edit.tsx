import Page from 'components/page';
import { Appeal } from 'lib/entities/types';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';
import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SingleEditPageProps } from 'pages/types';

export default function AppealEditPage( {
	originalTitle,
}: SingleEditPageProps< Appeal > ) {
	return <Page title={ originalTitle }>TODO</Page>;
}

export const getStaticProps: GetSinglePageProps< Appeal > = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );
