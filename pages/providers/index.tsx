import React from 'react';
import { Container, Link } from '@mui/material';

import Header, { ActionItem } from 'components/header';
import Footer from 'components/footer';
import DataTable, { DataTableColumn } from 'components/data-table';
import { entityDateToTS, entityTStoDate } from 'lib/casting';
import { queryAllProviders } from 'lib/db/helpers';
import { rowToProvider } from 'lib/entities/provider';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';

import type { GetStaticPropsContext } from 'next';
import type { StringKeys } from 'global-types';
import type { PaginatedPageProps } from 'pages/types';
import type { Provider } from 'lib/entities/types';

export default function ProvidersPage( {
	currentPage,
	totalPages,
	records: rawRecords,
}: PaginatedPageProps< Provider > ) {
	const records = rawRecords.map( entityTStoDate ) as typeof rawRecords;
	const actions: ActionItem[] = [
		{
			href: '/providers/new',
			action: 'New provider',
			icon: 'add',
		},
	];
	const columns: DataTableColumn< StringKeys< Provider > >[] = [
		{
			key: 'name',
			name: 'Name',
			link: true,
		},
		{
			key: 'phone',
			name: 'Phone Number',
			format: ( value: string ) => (
				<Link href={ `tel:${ value }` } color="inherit">
					{ value }
				</Link>
			),
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Providers" actions={ actions } />
			</Container>
			<DataTable< Provider >
				basePath="/providers"
				columns={ columns }
				loading={ false }
				currentPage={ currentPage }
				totalCount={ totalPages }
				rows={ records }
			/>
			<Footer wrap />
		</>
	);
}

export async function getStaticProps( { params }: GetStaticPropsContext ) {
	// Pagination.
	const pageSize = 20;
	const currentPage = getPageNumber( params?.page );
	const totalPages = await getTotalPageNumber(
		queryAllProviders(),
		pageSize
	);

	// Gets records.
	const calls = await queryAllProviders()
		.limit( pageSize )
		.offset( currentPage * pageSize );
	const records = calls.map( ( row ) =>
		entityDateToTS( rowToProvider( row ) )
	);

	return {
		props: {
			title: 'Providers',
			currentPage,
			totalPages,
			records,
		},
	};
}
