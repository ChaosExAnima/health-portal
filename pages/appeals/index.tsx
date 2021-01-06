import { Container } from '@material-ui/core';
import React from 'react';

import Header, { ActionItem } from 'components/header';
import Footer from 'components/footer';
import DataTable, { DataTableColumn, DataTableFilter } from 'components/data-table';
import { useAppealsIndexQuery } from 'lib/apollo/queries/appeals.graphql';
import { capitalize } from 'lib/strings';

import type { PaginatedPageProps } from 'global-types';

const AppealsPage: React.FC<PaginatedPageProps> = ( { title, currentPage } ) => {
	const { data, loading } = useAppealsIndexQuery( { variables: { offset: 0 } } );

	const actions: ActionItem[] = [
		{
			href: '/appeals/new',
			action: 'New appeal',
			icon: 'add',
		},
	];
	const filters: DataTableFilter[] = [
		{
			key: 'status',
			label: 'Status',
			type: 'select',
			values: {
				NEW: 'New',
				PENDING: 'Pending',
				CLOSED: 'Closed',
			},
		},
		{
			key: 'provider',
			label: 'Provider',
			type: 'select',
			values: {},
		},
	];
	const columns: DataTableColumn[] = [
		{
			align: 'right',
			key: 'created',
			name: 'Date Started',
			width: 150,
		},
		{
			key: 'name',
			name: 'Name',
			link: true,
		},
		{
			key: 'status',
			name: 'Status',
			format: capitalize,
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title={ title } actions={ actions } />
			</Container>
			<DataTable
				basePath="/appeals"
				columns={ columns }
				currentPage={ currentPage }
				filters={ filters }
				loading={ loading }
				rows={ data?.getAppeals.appeals }
				totalCount={ data?.getAppeals.totalCount }
			/>
			<Footer wrap />
		</>
	);
};

export async function getStaticProps(): Promise<{ props: PaginatedPageProps }> {
	return {
		props: {
			title: 'Appeals',
			currentPage: 0,
		},
	};
}

export default AppealsPage;
