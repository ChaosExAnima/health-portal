import React from 'react';
import { Container } from '@mui/material';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import { Detail, DetailsBox } from 'components/details-box';
import { queryAllProviders, queryContentType } from 'lib/db/helpers';
import { rowToProvider } from 'lib/entities/provider';

import type { SetRequired } from 'type-fest';
import type { GetStaticPathsResult } from 'next';
import type { GetSinglePageProps, SinglePageProps } from 'pages/types';
import type { Provider } from 'lib/entities/types';

export type ProviderWithAdditions = SetRequired< Provider, 'claims' | 'notes' >;

const ProviderPage: React.FC< SinglePageProps< ProviderWithAdditions > > = ( {
	slug,
	record,
} ) => {
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [
					{ href: '/providers', name: 'Providers' },
					record.name,
				] }
			/>
			<Header
				title={ record.name }
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
				<Detail label="Phone Number">{ record.phone }</Detail>
				<Detail label="Email">{ record.email }</Detail>
				<Detail label="Address">{ record.address }</Detail>
				<Detail label="Website">{ record.website }</Detail>
			</DetailsBox>
		</Container>
	);
};

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryAllProviders().select( 'slug' );
	return {
		paths: claims.map( ( { slug } ) => `/providers/${ slug }` ),
		fallback: false,
	};
}

export const getStaticProps: GetSinglePageProps< ProviderWithAdditions > = async ( {
	params,
} ) => {
	if ( ! params ) {
		return {
			notFound: true,
		};
	}
	const { slug } = params;
	const row = await queryAllProviders().where( 'slug', slug ).first();
	if ( ! row ) {
		return {
			notFound: true,
		};
	}
	const relations = await queryContentType( [ 'claim', 'note' ] )
		.andWhere( 'providerId', row.id )
		.limit( 10 )
		.orderBy( 'created', 'desc' );
	const record = rowToProvider( row, { relations } );
	return {
		props: {
			id: row.id,
			slug,
			title: row.name,
			record,
		},
	};
};

export default ProviderPage;
