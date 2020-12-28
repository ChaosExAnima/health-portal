import { Box, Container } from '@material-ui/core';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import DetailsBox from 'components/details-box';
import ProviderLink from 'components/provider-link';
import { initializeApollo } from 'lib/apollo';
import {
	AppealDocument,
	AppealQuery,
	AppealsSlugsDocument,
	AppealsSlugsQuery,
} from 'lib/apollo/queries/appeals.graphql';
import { staticPathsNoData } from 'lib/static-helpers';
import { capitalize } from 'lib/strings';

import type { PageProps } from 'global-types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import HistoryTable from 'components/history-table';

type AppealPageProps = PageProps & AppealQuery & {
	slug: string;
};

const AppealPage: React.FC<AppealPageProps> = ( { title, appeal } ) => {
	if ( ! appeal ) {
		return null;
	}
	const { slug, id, name, status, date, provider } = appeal;
	return (
		<Container maxWidth="md">
			<Breadcrumbs breadcrumbs={ [
				{ href: '/appeals', name: 'Appeals' },
				name,
			] } />
			<Header title={ title } actions={ [
				{ action: 'Update', icon: 'add' },
				{ action: 'Edit appeal', href: `/appeals/${ slug }/edit`, icon: 'edit', color: 'secondary' },
			] } />
			<DetailsBox details={ [
				{ name: 'Status', detail: capitalize( status ) },
				{ name: 'For provider', detail: <ProviderLink provider={ provider } color="inherit" /> },
				{ name: 'Last updated', detail: date },
				{ name: 'Update due', detail: date },
			] } />
			<Box my={ 4 }>
				<HistoryTable type="appeal" id={ id } />
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const client = initializeApollo();
	const { data } = await client.query<AppealsSlugsQuery>( { query: AppealsSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getAppeals.appeals.map( ( appeal ) => appeal && `/appeals/${ appeal.slug }` ),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps<AppealPageProps> = async () => {
	const client = initializeApollo();
	const { data } = await client.query<AppealQuery>( { query: AppealDocument, variables: { slug: 'foo12334' } } );
	return {
		props: {
			title: 'Appeal on 1/1/2020',
			slug: data.appeal.slug,
			appeal: data.appeal,
		},
	};
};

export default AppealPage;
