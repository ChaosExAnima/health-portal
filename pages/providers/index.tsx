import React from 'react';
import { Container, Link } from '@material-ui/core';

import Header, { ActionItem } from 'components/header';
import Footer from 'components/footer';
import DataTable, { DataTableColumn } from 'components/data-table';
import { queryAllProviders } from 'lib/db/helpers';
import { rowToProvider } from 'lib/entities/provider';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';

import type {
	PaginatedPageContext,
	PaginatedPageProps,
	StringKeys,
} from 'global-types';
import type { Provider } from 'lib/entities/types';
import type { GetStaticProps } from 'next';

const ProvidersPage: React.FC< PaginatedPageProps< Provider > > = ( {
	currentPage,
	totalPages,
	records,
} ) => {
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
};

export const getStaticProps: GetStaticProps<
	PaginatedPageProps< Provider >,
	PaginatedPageContext
> = async ( { params } ) => {
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
	const records = calls.map( ( row ) => rowToProvider( row ) );
	return {
		props: {
			title: 'Providers',
			currentPage,
			totalPages,
			records,
		},
	};
};

export default ProvidersPage;
