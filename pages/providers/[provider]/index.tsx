import React from 'react';
import { Box, Container, LinearProgress } from '@material-ui/core';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import DetailsBox, { Detail } from 'components/details-box';
import HistoryTable from 'components/history-table';
import { useProviderQuery } from 'lib/apollo/queries/providers.graphql';
import { staticPathsFromSlugs } from 'lib/static-helpers';
import { query } from 'lib/db';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import type Provider from 'lib/db/entities/provider';

const ProviderPage: React.FC< SinglePageProps > = ( { id, slug } ) => {
	const { data, loading } = useProviderQuery( { variables: { slug } } );
	if ( ! slug ) {
		return null;
	}
	const provider = data && data.provider;
	if ( ! provider || loading ) {
		return (
			<Container maxWidth="md">
				<Box my={ 4 }>
					<LinearProgress />
				</Box>
			</Container>
		);
	}
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [
					{ href: '/providers', name: 'Providers' },
					provider.name,
				] }
			/>
			<Header
				title={ provider.name }
				buttonsBelow
				actions={ [
					{ action: 'Add Event', icon: 'add' },
					{
						action: 'Edit',
						href: `/providers/${ slug }/edit`,
						icon: 'edit',
					},
				] }
			/>
			<DetailsBox>
				<Detail name="Phone Number">{ provider.phone }</Detail>
				<Detail name="Email">{ provider.email }</Detail>
				<Detail name="Address">{ provider.address }</Detail>
				<Detail name="Website">{ provider.website }</Detail>
			</DetailsBox>
			<Box my={ 4 }>
				<HistoryTable type="provider" id={ id } />
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () =>
	staticPathsFromSlugs( 'Provider', 'providers' );

export const getStaticProps: GetStaticProps<
	SinglePageProps,
	{ provider: string }
> = async ( { params } ) => {
	if ( ! params ) {
		return {
			notFound: true,
		};
	}
	const { provider: providerSlug } = params;
	const em = await query();
	const provider = await em.findOne< Provider >( 'Provider', {
		slug: providerSlug,
	} );
	if ( ! provider ) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			id: provider.id,
			slug: providerSlug,
			title: provider.name,
		},
	};
};

export default ProviderPage;
