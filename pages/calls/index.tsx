import React from 'react';
import { Container } from '@material-ui/core';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import ProviderLink from 'components/provider-link';
import rowToCall from 'lib/entities/call';
import {
	getIdColumn,
	queryCalls,
	queryProviderBySlug,
	queryRelatedProviders,
} from 'lib/db/helpers';
import { useProvidersForSelect } from 'lib/hooks';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';
import { formatDate } from 'lib/strings';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { PaginatedPageProps, StringKeys } from 'global-types';
import type { Call, Provider } from 'lib/entities/types';

type CallsProps = PaginatedPageProps< Call > & {
	query: {
		start?: string;
		end?: string;
		provider?: string;
	};
};

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
			default: query.provider,
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
	const callsQuery = queryCalls()
		.limit( pageSize )
		.offset( currentPage * pageSize );
	if ( query.start ) {
		callsQuery.andWhere( 'created', '>=', query.start );
	}
	if ( query.end ) {
		callsQuery.andWhere( 'created', '<=', query.end );
	}
	if ( query.provider && ! Array.isArray( query.provider ) ) {
		const provider = await queryProviderBySlug( query.provider );
		if ( provider ) {
			callsQuery.andWhere( 'providerId', provider.id );
		}
	}
	const calls = await callsQuery;
	const providers = await queryRelatedProviders(
		getIdColumn( calls, 'providerId' )
	);
	const records = calls.map( ( row ) => rowToCall( row, { providers } ) );
	return {
		props: {
			title: 'Calls',
			currentPage,
			totalPages,
			records,
			query,
		},
	};
}

export default CallsPage;
