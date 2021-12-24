import { Box, Container } from '@material-ui/core';
import { SetRequired } from 'type-fest';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import HistoryTable from 'components/history-table';

import type { SinglePageProps } from 'global-types';
import type { GetStaticPathsResult, GetStaticProps } from 'next';
import { queryAppeals } from 'lib/entities/db';
import { Appeal } from 'lib/entities/types';
import rowToAppeal from 'lib/entities/appeal';

type AppealProps = SinglePageProps & {
	appeal: SetRequired< Appeal, 'claims' | 'notes' >;
};

const AppealPage: React.FC< AppealProps > = ( { title, slug, id, appeal } ) => {
	if ( ! slug || ! id ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [ { href: '/appeals', name: 'Appeals' }, title ] }
			/>
			<Header
				title={ appeal.name }
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
			<Box my={ 4 }>
				<HistoryTable type="appeal" id={ id } />
			</Box>
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

export const getStaticProps: GetStaticProps = async ( { params } ) => {
	const appealObj = await queryAppeals()
		.andWhere( 'slug', params?.slug )
		.first();
	if ( ! appealObj ) {
		return {
			notFound: true,
		};
	}
	const appeal = rowToAppeal( appealObj, {} );
	return {
		props: {
			title: appeal.name,
			slug: appeal.slug,
			id: appeal.id,
			appeal,
		},
	};
};

export default AppealPage;
