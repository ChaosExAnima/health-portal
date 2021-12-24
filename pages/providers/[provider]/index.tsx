import React from 'react';
import { Container } from '@material-ui/core';

import Header from 'components/header';
import Breadcrumbs from 'components/breadcrumbs';
import DetailsBox, { Detail } from 'components/details-box';
import { queryAllProviders, queryContentType } from 'lib/entities/db';
import { rowToProvider } from 'lib/entities/provider';

import type { SetRequired } from 'type-fest';
import type { GetStaticPathsResult } from 'next';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';
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
				<Detail name="Phone Number">{ record.phone }</Detail>
				<Detail name="Email">{ record.email }</Detail>
				<Detail name="Address">{ record.address }</Detail>
				<Detail name="Website">{ record.website }</Detail>
			</DetailsBox>
		</Container>
	);
};

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryAllProviders().select( 'identifier' );
	return {
		paths: claims.map(
			( { identifier } ) => `/claims/${ identifier.toLowerCase() }`
		),
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
	const relations = await queryContentType( [ 'claim', 'note' ] ).andWhere(
		'providerId',
		row.id
	);
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
