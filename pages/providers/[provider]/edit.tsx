import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	LinearProgress,
} from '@material-ui/core';

import Breadcrumbs from 'components/breadcrumbs';
import Header from 'components/header';
import DetailsBox, { Detail } from 'components/details-box';
import { useProviderQuery } from 'lib/apollo/queries/providers.graphql';
import { getStaticPaths as getRootStaticPaths, getStaticProps as getRootStaticProps } from './index';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';
import type { Provider } from 'lib/apollo/schema/index.graphqls';

const ProviderEditPage: React.FC<SinglePageProps> = ( { slug } ) => {
	const [ provider, updateProvider ] = useState< Provider >();
	const { data, loading } = useProviderQuery( { variables: { slug } } );
	useEffect( () => {
		if ( data && data.provider ) {
			updateProvider( data.provider );
		}
	}, [ data ] );
	if ( ! slug ) {
		return null;
	}
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
			<Breadcrumbs breadcrumbs={ [
				{ href: '/providers', name: 'Providers' },
				{ href: `/providers/${ slug }`, name: provider.name },
				'Edit',
			] } />
			<Header title={ provider.name } buttonsBelow edit onChange={ ( name ) => updateProvider( { ...provider, name } ) } actions={ [
				{ action: 'Save', icon: 'save' },
				{ action: 'Cancel', href: `/providers/${ slug }`, icon: 'cancel', color: 'secondary' },
			] } />
			<DetailsBox edit onChange={ ( key, value ) => updateProvider( { ...provider, [ key ]: value } ) }>
				<Detail name="Website" type="url" id="website">{ provider.website }</Detail>
				<Detail name="Email" id="email">{ provider.email }</Detail>
				<Detail name="Phone Number" id="phone">{ provider.phone }</Detail>
				<Detail name="Address" id="address">{ provider.address }</Detail>
			</DetailsBox>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetStaticProps = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export default ProviderEditPage;
