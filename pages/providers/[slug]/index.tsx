import React from 'react';
import { Container } from '@mui/material';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import { Detail, DetailsBox } from 'components/details-box';
import { fromArray } from 'lib/casting';
import { queryAllProviders, queryContentType } from 'lib/db/helpers';
import { rowToProvider } from 'lib/entities/provider';

import type { GetStaticPathsResult, GetStaticPropsContext } from 'next';
import type { SetRequired } from 'type-fest';
import type { GetSinglePageResult, SinglePageProps } from 'pages/types';
import type { Provider } from 'lib/entities/types';

export type ProviderWithAdditions = SetRequired< Provider, 'claims' | 'notes' >;

function ProviderPage( {
	slug,
	record,
}: SinglePageProps< ProviderWithAdditions > ) {
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
}

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryAllProviders().select( 'slug' );
	return {
		paths: claims.map( ( { slug } ) => `/providers/${ slug }` ),
		fallback: false,
	};
}

export async function getStaticProps( {
	params,
}: GetStaticPropsContext ): GetSinglePageResult< ProviderWithAdditions > {
	if ( ! params ) {
		return {
			notFound: true,
		};
	}
	const slug = fromArray( params.slug );
	if ( ! slug ) {
		return {
			notFound: true,
		};
	}
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
}

export default ProviderPage;
