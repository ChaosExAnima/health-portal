import {
	Box,
	Container,
	LinearProgress,
} from '@material-ui/core';
import React from 'react';

import DetailsBox from 'components/details-box';
import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import initDb from 'lib/db';
import { staticPathsFromSlugs } from 'lib/static-helpers';
import numberFormat from 'lib/number-format';
import { claimStatus } from 'lib/strings';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import { Claim } from 'lib/db/entities';
import { useClaimQuery } from 'lib/apollo/queries/claims.graphql';

const ClaimPage: React.FC<SinglePageProps> = ( { id, slug } ) => {
	const { data, loading } = useClaimQuery( { variables: { slug } } );
	if ( ! slug ) {
		return null;
	}
	const claim = data && data.claim;
	return (
		<Container maxWidth="md">
			<Breadcrumbs breadcrumbs={ [
				{ href: '/claims', name: 'Claims' },
				slug,
			] } />
			<Header title={ `Claim # ${ slug }` } buttonsBelow actions={ [
				{ action: 'Add Event', icon: 'add' },
				{ action: 'Edit', href: `/claims/${ slug }/edit`, icon: 'edit' },
			] } />
			{ loading && <LinearProgress /> }
			{ claim && (
				<DetailsBox details={ [
					{ name: 'Status', detail: claimStatus( claim.status ) },
					{ name: 'Date of service', detail: claim.date as Date },
					{ name: 'Provider', detail: (
						<ProviderLink provider={ claim.provider } color="inherit" />
					) },
					{ name: 'Amount billed', detail: numberFormat( claim.billed || 0, true ) },
					{ name: 'You owe', detail: numberFormat( claim.cost || 0, true ) },
					{ name: 'You are owed', detail: numberFormat( claim.owed || 0, true ) },
				] } />
			) }
			<Box my={ 4 }>
				<HistoryTable type="claim" id={ id } />
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () => staticPathsFromSlugs( Claim, 'claims' );

export const getStaticProps: GetStaticProps<SinglePageProps, { claim: string }> = async ( { params } ) => {
	if ( ! params ) {
		return {
			notFound: true,
		};
	}
	const { claim: claimSlug } = params;
	const db = await initDb();
	const claim = await db.em.findOne( Claim, { slug: claimSlug } );
	if ( ! claim ) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			id: claim.id,
			title: `Claim # ${ claim.number }`,
			slug: claimSlug,
		},
	};
};

export default ClaimPage;
