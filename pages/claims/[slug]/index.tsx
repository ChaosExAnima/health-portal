import React from 'react';
import { Container } from '@material-ui/core';

import DetailsBox, { Detail } from 'components/details-box';
import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import ProviderLink from 'components/provider-link';
import rowToClaim from 'lib/entities/claim';
import {
	queryClaims,
	queryMeta,
	queryProvider,
	queryRelated,
} from 'lib/entities/db';
import { formatClaimStatus, formatCurrency, formatDate } from 'lib/strings';

import type { GetStaticPathsResult } from 'next';
import type { SetRequired } from 'type-fest';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';
import type { Claim } from 'lib/entities/types';

export type ClaimWithAdditions = SetRequired<
	Claim,
	'billed' | 'cost' | 'notes'
>;

export default function ClaimPage( {
	id,
	slug,
	record,
}: SinglePageProps< ClaimWithAdditions > ): JSX.Element {
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
					{ formatClaimStatus( record.status ) }
				</Detail>
				<Detail name="Date of service">
					{ formatDate( 'YYYY-MM-DD' )( record.date ) }
				</Detail>
				<Detail name="Provider">
					{ record.provider && (
						<ProviderLink
							provider={ record.provider }
							color="inherit"
						/>
					) }
					{ ! record.provider && 'Missing' }
				</Detail>
				<Detail name="Amount billed">
					{ formatCurrency( record.billed ) }
				</Detail>
				<Detail name="You owe">
					{ formatCurrency( record.cost ) }
				</Detail>
				<Detail name="You are owed">{ formatCurrency( 0 ) }</Detail>
			</DetailsBox>
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

export const getStaticProps: GetSinglePageProps< ClaimWithAdditions > = async ( {
	params,
} ) => {
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
	const relations = await queryRelated( row.id );
	const record = rowToClaim( row, { meta, provider, relations } );
	return {
		props: {
			id: row.id,
			slug,
			title: `Claim ${ row.identifier }`,
			record,
		},
	};
};
