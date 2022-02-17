import React from 'react';
import { Container } from '@mui/material';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import ProviderLink from 'components/provider-link';
import {
	filterQuery,
	getIdColumn,
	queryCalls,
	queryRelatedProviders,
} from 'lib/db/helpers';
import { rowToCall } from 'lib/entities/call';
import { useProvidersForSelect } from 'lib/hooks';
import {
	getPageNumber,
	getTotalPageNumber,
	serialize,
} from 'lib/static-helpers';
import { formatDate } from 'lib/strings';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { PaginatedPageProps, StringKeys } from 'global-types';
import type {
	DateQuery,
	PaginationQuery,
	ProviderQuery,
	WithQuery,
} from 'components/data-table/types';
import type { ContentDB } from 'lib/db/types';
import type { Call, Provider } from 'lib/entities/types';

type CallsProps = PaginatedPageProps< Call > &
	WithQuery< DateQuery & PaginationQuery & ProviderQuery >;

const CallsPage: React.FC< CallsProps > = ( {
	currentPage,
	totalPages,
	records,
	query,
} ) => {
	const providers = useProvidersForSelect();
	const actions: ActionItem[] = [
		{
			href: '/calls/new',
			action: 'New call',
			icon: 'add',
		},
	];
	const filters: DataTableFilter< StringKeys< Call > >[] = [
		{
			key: 'provider',
			label: 'Provider',
			type: 'select',
			values: providers,
			default: query.provider || 'all',
		},
	];
	const columns: DataTableColumn< StringKeys< Call > >[] = [
		{
			key: 'created',
			link: true,
			name: 'Date',
			align: 'right',
			width: 200,
			format: formatDate( 'MM/D/YY' ),
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
			format: ( provider: Provider ) => (
				<ProviderLink color="inherit" provider={ provider } />
			),
		},
		{
			key: 'reason',
			name: 'Reason',
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Calls" actions={ actions } />
			</Container>
			<DataTable< Call >
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

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise< GetServerSidePropsResult< CallsProps > > {
	const { params, query } = context;
	// Pagination.
	const pageSize = 20;
	const currentPage = getPageNumber( params?.page );
	const totalPages = await getTotalPageNumber( queryCalls(), pageSize );

	// Gets records.
	const calls: ContentDB[] = await filterQuery( queryCalls(), query );
	const providers = await queryRelatedProviders(
		getIdColumn( calls, 'providerId' )
	);
	const records = calls.map( ( row ) => rowToCall( row, { providers } ) );
	return {
		props: {
			title: 'Calls',
			currentPage,
			totalPages,
			records: serialize( records ),
			query,
		},
	};
}

export default CallsPage;
