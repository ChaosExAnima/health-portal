import { Box, Container } from '@material-ui/core';
import React from 'react';
import type {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import type { SetRequired } from 'type-fest';

import DetailsBox, { Detail } from 'components/details-box';
import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import rowToClaim from 'lib/entities/claim';
import { queryClaims, queryMeta, queryProvider } from 'lib/entities/db';
import { Claim } from 'lib/entities/types';
import { rowToProvider } from 'lib/entities/provider';
import { formatClaimStatus, formatCurrency, formatDate } from 'lib/strings';
import type { SinglePageContext, SinglePageProps } from 'global-types';

type ClaimPageProps = SinglePageProps & {
	claim: SetRequired< Claim, 'billed' | 'cost' >;
};

export default function ClaimPage( {
	id,
	slug,
	claim,
}: ClaimPageProps ): JSX.Element {
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [ { href: '/claims', name: 'Claims' }, slug ] }
			/>
			<Header
				title={ `Claim # ${ slug }` }
				buttonsBelow
				actions={ [
					{ action: 'Add Event', icon: 'add' },
					{
						action: 'Edit',
						href: `/claims/${ slug }/edit`,
						icon: 'edit',
					},
				] }
			/>
			<DetailsBox>
				<Detail name="Status">
					{ formatClaimStatus( claim.status ) }
				</Detail>
				<Detail name="Date of service">
					{ formatDate( 'YYYY-MM-DD' )( claim.date ) }
				</Detail>
				<Detail name="Provider">
					{ claim.provider && (
						<ProviderLink
							provider={ claim.provider }
							color="inherit"
						/>
					) }
					{ ! claim.provider && 'Missing' }
				</Detail>
				<Detail name="Amount billed">
					{ formatCurrency( claim.billed ) }
				</Detail>
				<Detail name="You owe">{ formatCurrency( claim.cost ) }</Detail>
				<Detail name="You are owed">{ formatCurrency( 0 ) }</Detail>
			</DetailsBox>
			<Box my={ 4 }>
				<HistoryTable type="claim" id={ id } />
			</Box>
		</Container>
	);
}

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryClaims().select( 'identifier' );
	return {
		paths: claims.map(
			( { identifier } ) => `/claims/${ identifier.toLowerCase() }`
		),
		fallback: false,
	};
}

export async function getStaticProps( {
	params,
}: GetStaticPropsContext< SinglePageContext > ): Promise<
	GetStaticPropsResult< ClaimPageProps >
> {
	const slug = params?.slug;
	if ( ! slug ) {
		return {
			notFound: true,
		};
	}
	const row = await queryClaims()
		.andWhere( 'identifier', slug.toUpperCase() )
		.first();
	if ( ! row ) {
		return {
			notFound: true,
		};
	}
	const meta = await queryMeta( row.id );
	const provider = await queryProvider( row.providerId );
	const claim = rowToClaim( row, { meta } );
	claim.provider = provider && rowToProvider( provider );
	return {
		props: {
			id: row.id,
			slug,
			title: `Claim ${ row.identifier }`,
			claim,
		},
	};
}
