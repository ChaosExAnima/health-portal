import { Container } from '@material-ui/core';
import React from 'react';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';

import type { PaginatedPageProps } from 'global-types';
import { useCallsIndexQuery } from 'lib/apollo/queries/calls.graphql';
import { Note } from 'lib/db/entities';

const CallsPage: React.FC< PaginatedPageProps > = ( { currentPage } ) => {
	const { data, loading } = useCallsIndexQuery( {
		variables: { offset: 0 },
	} );

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
	const columns: DataTableColumn[] = [
		{
			key: 'date',
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
			key: 'note',
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
				loading={ loading }
				rows={ data?.getCalls.calls }
				totalCount={ data?.getCalls.totalCount }
				hasDates
			/>
			<Footer wrap />
		</>
	);
};

export async function getStaticProps(): Promise< {
	props: PaginatedPageProps;
} > {
	return {
		props: {
			title: 'Calls',
			currentPage: 0,
		},
	};
}

export default CallsPage;
