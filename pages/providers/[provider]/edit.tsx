import React from 'react';
import { Container } from '@material-ui/core';
import { useRouter } from 'next/router';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';
import Breadcrumbs from 'components/breadcrumbs';
import Header from 'components/header';
import DetailsBox, { Detail } from 'components/details-box';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import type { Provider } from 'lib/entities/types';

const ProviderEditPage: React.FC< SinglePageProps< Provider > > = ( {
	record,
} ) => {
	const router = useRouter();
	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [
					{ href: '/providers', name: 'Providers' },
					{ href: `/providers/${ record.slug }`, name: record.name },
					'Edit',
				] }
			/>
			<Header
				title={ record.name }
				buttonsBelow
				edit
				// eslint-disable-next-line no-console
				onChange={ ( name ) => console.log( name ) }
				actions={ [
					{
						action: 'Save',
						icon: 'save',
						onClick: async () => {
							router.push( `/providers/${ record.slug }` );
						},
						disabled: false,
					},
					{
						action: 'Cancel',
						href: `/providers/${ record.slug }`,
						icon: 'cancel',
						color: 'secondary',
					},
				] }
			/>
			<DetailsBox
				edit
				// eslint-disable-next-line no-console
				onChange={ ( key, value ) => console.log( key, value ) }
			>
				<Detail name="Website" type="url" id="website">
					{ record.website }
				</Detail>
				<Detail name="Email" id="email">
					{ record.email }
				</Detail>
				<Detail name="Phone Number" id="phone">
					{ record.phone }
				</Detail>
				<Detail name="Address" id="address">
					{ record.address }
				</Detail>
			</DetailsBox>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetStaticProps = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export default ProviderEditPage;
