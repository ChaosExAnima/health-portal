import { Container } from '@material-ui/core';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import rowToAppeal from 'lib/entities/appeal';
import { queryAppeals, queryRelatedOfType } from 'lib/entities/db';

import type { GetStaticPathsResult } from 'next';
import type { SetRequired } from 'type-fest';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';
import type { Appeal } from 'lib/entities/types';

type AppealWithAdditions = SetRequired< Appeal, 'claims' | 'notes' >;

const AppealPage: React.FC< SinglePageProps< AppealWithAdditions > > = ( {
	title,
	slug,
	id,
	record,
} ) => {
	if ( ! slug || ! id ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [ { href: '/appeals', name: 'Appeals' }, title ] }
			/>
			<Header
				title={ record.name }
				actions={ [
					{ action: 'Update', icon: 'add' },
					{
						action: 'Edit appeal',
						href: `/appeals/${ slug }/edit`,
						icon: 'edit',
						color: 'secondary',
					},
				] }
			/>
		</Container>
	);
};

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryAppeals().select( 'identifier' );
	return {
		paths: claims.map(
			( { identifier } ) => `/appeals/${ identifier.toLowerCase() }`
		),
		fallback: false,
	};
}

export const getStaticProps: GetSinglePageProps< AppealWithAdditions > = async ( {
	params,
} ) => {
	const appealObj = await queryAppeals()
		.andWhere( 'slug', params?.slug )
		.first();
	if ( ! appealObj ) {
		return {
			notFound: true,
		};
	}
	const relations = await queryRelatedOfType( appealObj.id, [
		'note',
		'claim',
	] );
	const record = rowToAppeal( appealObj, { relations } );

	return {
		props: {
			id: record.id,
			slug: record.slug,
			title: record.name,
			record: record as AppealWithAdditions,
		},
	};
};

export default AppealPage;
