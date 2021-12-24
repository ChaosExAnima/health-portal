import React from 'react';
import { Container } from '@material-ui/core';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import rowToCall from 'lib/entities/call';
import { queryCalls } from 'lib/entities/db';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';

import type { GetStaticProps } from 'next';
import type { PaginatedPageContext, PaginatedPageProps } from 'global-types';
import type { Call, Note } from 'lib/entities/types';

type CallsProps = PaginatedPageProps< Call >;

const CallsPage: React.FC< CallsProps > = ( {
	currentPage,
	totalPages,
	records,
} ) => {
	const actions: ActionItem[] = [
		{
			href: '/calls/new',
			action: 'New call',
			icon: 'add',
		},
	];
	const filters: DataTableFilter[] = [
		{
			key: 'provider',
			label: 'Provider',
			type: 'select',
			values: {},
		},
	];
	const columns: DataTableColumn< keyof Call >[] = [
		{
			key: 'created',
			link: true,
			name: 'Date',
			align: 'right',
			width: 200,
		},
		{
			key: 'reps',
			link: true,
			name: 'Representative',
			width: 200,
			format: ( values: string[] | null ) =>
				values && values.length ? values.join( ', ' ) : 'Unknown',
		},
		{
			key: 'provider',
			name: 'Provider',
		},
		{
			key: 'notes',
			link: true,
			name: 'Description',
			format: ( note: Pick< Note, 'description' > ) => note.description,
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Calls" actions={ actions } />
			</Container>
			<DataTable
				basePath="/calls"
				columns={ columns }
				currentPage={ currentPage }
				filters={ filters }
				loading={ false }
				rows={ records }
				totalCount={ totalPages }
				hasDates
			/>
			<Footer wrap />
		</>
	);
};

export const getStaticProps: GetStaticProps<
	PaginatedPageProps< Call >,
	PaginatedPageContext
> = async ( { params } ) => {
	// Pagination.
	const pageSize = 20;
	const currentPage = getPageNumber( params?.page );
	const totalPages = await getTotalPageNumber( queryCalls(), pageSize );

	// Gets records.
	const calls = await queryCalls()
		.limit( pageSize )
		.offset( currentPage * pageSize );
	const records = calls.map( ( row ) => rowToCall( row ) );
	return {
		props: {
			title: 'Calls',
			currentPage,
			totalPages,
			records,
		},
	};
};

export default CallsPage;
