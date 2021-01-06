import { Box, Container } from '@material-ui/core';

import initDb from 'lib/db';
import Call from 'lib/db/entities/call';
import { staticPathsFromSlugs } from 'lib/static-helpers';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { SinglePageProps } from 'global-types';

const CallPage: React.FC<SinglePageProps> = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				Hello
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async () => staticPathsFromSlugs( Call, 'calls' );

export const getStaticProps: GetStaticProps<SinglePageProps, { call: string }> = async ( { params } ) => {
	const db = await initDb();
	const call = params && await db.em.findOne( Call, { slug: params.call }, [ 'provider' ] );
	if ( ! call ) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			id: call.id,
			slug: call.slug,
			title: `Call with ${ call.provider.getProperty( 'name' ) } on ${ call.created }`,
		},
	};
};

export default CallPage;
