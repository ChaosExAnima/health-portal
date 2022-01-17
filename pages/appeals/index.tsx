import { Container } from '@material-ui/core';
import React from 'react';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import rowToAppeal from 'lib/entities/appeal';
import { queryAppeals } from 'lib/db/helpers';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';
import { capitalize } from 'lib/strings';

import type { PaginatedPageProps } from 'global-types';
import type { GetStaticPropsContext } from 'next';
import type { Appeal } from 'lib/entities/types';

type AppealsProps = PaginatedPageProps< Appeal >;

const AppealsPage: React.FC< AppealsProps > = ( {
	title,
	currentPage,
	totalPages,
	records,
} ) => {
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
			values: new Map(
				Object.entries( {
					NEW: 'New',
					PENDING: 'Pending',
					CLOSED: 'Closed',
				} )
			),
		},
		{
			key: 'provider',
			label: 'Provider',
			type: 'select',
			values: new Map(),
		},
	];
	const columns: DataTableColumn< keyof Appeal >[] = [
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
			<DataTable< Appeal >
				basePath="/appeals"
				columns={ columns }
				currentPage={ currentPage }
				filters={ filters }
				rows={ records }
				totalCount={ totalPages }
				loading={ false }
			/>
			<Footer wrap />
		</>
	);
};

export async function getStaticProps( {
	params,
}: GetStaticPropsContext< { page: string } > ): Promise< {
	props: AppealsProps;
} > {
	// Pagination.
	const pageSize = 20;
	const currentPage = getPageNumber( params?.page );
	const totalPages = await getTotalPageNumber( queryAppeals(), pageSize );

	// Gets records.
	const appeals = await queryAppeals()
		.limit( pageSize )
		.offset( currentPage * pageSize );
	const records = appeals.map( ( row ) => rowToAppeal( row, {} ) );
	return {
		props: {
			title: 'Appeals',
			currentPage,
			totalPages,
			records,
		},
	};
}

export default AppealsPage;
