import React from 'react';
import { Container, Link } from '@material-ui/core';

import Header from 'components/header';
import Footer from 'components/footer';
import DataTable, { DataTableColumn } from 'components/data-table';
import { useProvidersIndexQuery } from 'lib/apollo/queries/providers.graphql';
import { toString } from 'lib/casting';

import type { PaginatedPageProps } from 'global-types';

const ProvidersPage: React.FC<PaginatedPageProps> = ( { currentPage } ) => {
	const { data, loading } = useProvidersIndexQuery( { variables: { offset: 0 } } );

	const columns: DataTableColumn[] = [
		{
			key: 'name',
			name: 'Name',
			link: true,
		},
		{
			key: 'phone',
			name: 'Phone Number',
			format: ( value ) => ( <Link href={ `tel:${ value }` } color="inherit">{ toString( value ) }</Link> ),
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Providers" actions={ [] } />
			</Container>
			<DataTable
				basePath="/providers"
				columns={ columns }
				loading={ loading }
				currentPage={ currentPage }
				totalCount={ data?.getProviders.totalCount }
				rows={ data?.getProviders.providers }
			/>
			<Footer wrap />
		</>
	);
};

export async function getStaticProps(): Promise<{ props: PaginatedPageProps }> {
	return {
		props: {
			title: 'Providers',
			currentPage: 0,
		},
	};
}

export default ProvidersPage;
