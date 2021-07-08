import { Box, Container } from '@material-ui/core';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import DetailsBox from 'components/details-box';
import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import initDb from 'lib/db';
import { staticPathsFromSlugs } from 'lib/static-helpers';
import { capitalize } from 'lib/strings';

import type { SinglePageProps } from 'global-types';
import type { GetStaticPaths, GetStaticProps } from 'next';

const AppealPage: React.FC< SinglePageProps > = ( { title, slug, id } ) => {
	const { data } = useAppealQuery( { variables: { slug } } );
	const appeal = data && data.appeal;
	if ( ! slug || ! id ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [ { href: '/appeals', name: 'Appeals' }, title ] }
			/>
			<Header
				title={ title }
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
			{ appeal && (
				<DetailsBox
					details={ [
						{ name: 'Status', detail: capitalize( status ) },
						{
							name: 'For provider',
							detail: (
								<ProviderLink
									provider={ appeal.provider }
									color="inherit"
								/>
							),
						},
						{ name: 'Last updated', detail: appeal.created },
						{ name: 'Update due', detail: appeal.created },
					] }
				/>
			) }
			<Box my={ 4 }>
				<HistoryTable type="appeal" id={ id } />
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () =>
	staticPathsFromSlugs( Appeal, 'appeals' );

export const getStaticProps: GetStaticProps<
	SinglePageProps,
	{ appeal: string }
> = async ( { params } ) => {
	const db = await initDb();
	const appeal =
		params && ( await db.em.findOne( Appeal, { slug: params.appeal } ) );
	if ( ! appeal ) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			title: appeal.name,
			slug: appeal.slug,
			id: appeal.id,
		},
	};
};

export default AppealPage;
