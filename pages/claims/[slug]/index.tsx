import { Container } from '@mui/material';
import React from 'react';

import Breadcrumbs from 'components/breadcrumbs';
import { Detail, DetailsBox } from 'components/details-box';
import Header from 'components/header';
import ProviderLink from 'components/provider-link';
import {
	queryClaims,
	queryMeta,
	queryProvider,
	queryRelated,
} from 'lib/db/helpers';
import { rowToClaim } from 'lib/entities/claim';
import { formatClaimStatus, formatCurrency, formatDate } from 'lib/strings';

import type { Claim } from 'lib/entities/types';
import type { GetStaticPathsResult } from 'next';
import type { GetSinglePageProps, SinglePageProps } from 'pages/types';
import type { SetRequired } from 'type-fest';

export type ClaimWithAdditions = SetRequired<
	Claim,
	'billed' | 'cost' | 'notes'
>;

export default function ClaimPage( {
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
				<Detail label="Status">
					{ formatClaimStatus( record.status ) }
				</Detail>
				<Detail label="Date of service">
					{ formatDate( 'YYYY-MM-DD' )( record.created ) }
				</Detail>
				<Detail label="Provider">
					{ record.provider && (
						<ProviderLink
							provider={ record.provider }
							color="inherit"
						/>
					) }
				</Detail>
				<Detail label="Amount billed">
					{ formatCurrency( record.billed ) }
				</Detail>
				<Detail label="You owe">
					{ formatCurrency( record.cost ) }
				</Detail>
				<Detail label="You are owed">{ formatCurrency( 0 ) }</Detail>
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
	const provider = row.providerId
		? await queryProvider( row.providerId )
		: undefined;
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
