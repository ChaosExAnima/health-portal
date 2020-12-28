import { Box, Container } from '@material-ui/core';
import React from 'react';

import DetailsBox from 'components/details-box';
import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import { initializeApollo } from 'lib/apollo';
import {
	Claim,
	ClaimDocument,
	ClaimQuery,
	ClaimQueryVariables,
	ClaimsSlugsDocument,
	ClaimsSlugsQuery,
} from 'lib/apollo/queries/claims.graphql';
import { staticPathsNoData } from 'lib/static-helpers';
import numberFormat from 'lib/number-format';
import { claimStatus } from 'lib/strings';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { PageProps } from 'global-types';

export type ClaimPageProps = PageProps & {
	claim: Claim;
};

const ClaimPage: React.FC<ClaimPageProps> = ( { claim } ) => {
	if ( ! claim ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Breadcrumbs breadcrumbs={ [
				{ href: '/claims', name: 'Claims' },
				claim.claim,
			] } />
			<Header title={ `Claim # ${ claim.claim }` } buttonsBelow actions={ [
				{ action: 'Add Event', icon: 'add' },
				{ action: 'Edit', href: `/claims/${ claim.slug }/edit`, icon: 'edit' },
			] } />
			<DetailsBox details={ [
				{ name: 'Status', detail: claimStatus( claim.status ) },
				{ name: 'Date of service', detail: claim.date },
				{ name: 'Provider', detail: (
					<ProviderLink provider={ claim.provider } color="inherit" />
				) },
				{ name: 'Amount billed', detail: numberFormat( claim.billed || 0, true ) },
				{ name: 'You owe', detail: numberFormat( claim.cost || 0, true ) },
				{ name: 'You are owed', detail: numberFormat( claim.owed || 0, true ) },
			] } />
			<Box my={ 4 }>
				<HistoryTable type="claim" id={ claim.id } />
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const client = initializeApollo();
	const { data } = await client.query<ClaimsSlugsQuery>( { query: ClaimsSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getClaims.claims.map( ( claim ) => claim && `/claims/${ claim.claim }` ),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps<ClaimPageProps> = async () => {
	const client = initializeApollo();
	const { data } = await client.query<ClaimQuery, ClaimQueryVariables>( { query: ClaimDocument, variables: { slug: '123456' } } );
	return {
		props: {
			title: data.claim.claim ? `Claim # ${ data.claim.claim }` : 'Claim',
			claim: data.claim,
		},
	};
};

export default ClaimPage;
