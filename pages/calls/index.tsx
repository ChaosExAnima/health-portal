import React from 'react';
import { Container } from '@material-ui/core';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import Link from 'components/link';
import rowToCall from 'lib/entities/call';
import {
	getIdColumn,
	queryCalls,
	queryRelatedProviders,
} from 'lib/entities/db';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';
import { formatDate } from 'lib/strings';
import { useProvidersForSelect } from 'lib/hooks';

import type { GetStaticProps } from 'next';
import type { PaginatedPageContext, PaginatedPageProps } from 'global-types';
import type { Call, Provider } from 'lib/entities/types';

type CallsProps = PaginatedPageProps< Call >;

const CallsPage: React.FC< CallsProps > = ( {
	currentPage,
	totalPages,
	records,
} ) => {
	const providers = useProvidersForSelect();
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
			values: providers,
		},
	];
	const columns: DataTableColumn< keyof Call >[] = [
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
				<Link href={ `/providers/${ provider.slug }` } color="inherit">
					{ provider.name }
				</Link>
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
		},
	};
};

export default CallsPage;
