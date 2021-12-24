import { Box, Container } from '@material-ui/core';
import { SetRequired } from 'type-fest';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import HistoryTable from 'components/history-table';

import type { SinglePageContext, SinglePageProps } from 'global-types';
import type { GetStaticPathsResult, GetStaticProps } from 'next';
import { queryAppeals, queryRelatedOfType } from 'lib/entities/db';
import { Appeal } from 'lib/entities/types';
import rowToAppeal from 'lib/entities/appeal';
import { CONTENT_CLAIM, CONTENT_NOTE } from 'lib/constants';
import rowToClaim from 'lib/entities/claim';
import rowToNote from 'lib/entities/note';

type AppealProps = SinglePageProps< SetRequired< Appeal, 'claims' | 'notes' > >;

const AppealPage: React.FC< AppealProps > = ( { title, slug, id, record } ) => {
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

export const getStaticProps: GetStaticProps<
	AppealProps,
	SinglePageContext
> = async ( { params } ) => {
	const appealObj = await queryAppeals()
		.andWhere( 'slug', params?.slug )
		.first();
	if ( ! appealObj ) {
		return {
			notFound: true,
		};
	}
	const record = rowToAppeal( appealObj, {} );

	const related = await queryRelatedOfType( record.id, [ 'note', 'claim' ] );
	record.claims = related
		.filter( ( { type } ) => type === CONTENT_CLAIM )
		.map( ( claim ) => rowToClaim( claim ) );
	record.notes = related
		.filter( ( { type } ) => type === CONTENT_NOTE )
		.map( ( note ) => rowToNote( note ) );
	return {
		props: {
			id: record.id,
			slug: record.slug,
			title: record.name,
			record: record as SetRequired< Appeal, 'claims' | 'notes' >,
		},
	};
};

export default AppealPage;
