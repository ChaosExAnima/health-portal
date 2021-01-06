import { Box, Container } from '@material-ui/core';

import { staticPathsFromSlugs } from 'lib/static-helpers';
import initDb from 'lib/db';
import Provider from 'lib/db/entities/provider';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';

const ProviderPage: React.FC<SinglePageProps> = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				Hello
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () =>
	staticPathsFromSlugs( Provider, 'providers' );

export const getStaticProps: GetStaticProps<SinglePageProps, { provider: string }> = async ( { params } ) => {
	if ( ! params ) {
		return {
			notFound: true,
		};
	}
	const { provider: providerSlug } = params;
	const db = await initDb();
	const provider = await db.em.findOne( Provider, { slug: providerSlug } );
	if ( ! provider ) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			id: provider.id,
			slug: providerSlug,
			title: provider.name,
		},
	};
};

export default ProviderPage;
