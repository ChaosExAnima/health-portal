import { Box, Container } from '@material-ui/core';

import rowToCall from 'lib/entities/call';
import {
	queryCalls,
	queryMeta,
	queryProvider,
	queryRelatedOfType,
	queryRelatedProviders,
} from 'lib/entities/db';
import { Call } from 'lib/entities/types';
import { dateToString } from 'lib/entities/utils';

import type { GetStaticPathsResult } from 'next';
import type { SetRequired } from 'type-fest';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';

type CallWithAdditions = SetRequired< Call, 'notes' | 'reps' >;

const CallPage: React.FC< SinglePageProps< CallWithAdditions > > = () => {
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>Hello</Box>
		</Container>
	);
};

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryCalls().select( 'identifier' );
	return {
		paths: claims.map(
			( { identifier } ) => `/calls/${ identifier.toLowerCase() }`
		),
		fallback: false,
	};
}

export const getStaticProps: GetSinglePageProps< CallWithAdditions > = async ( {
	params,
} ) => {
	const call = await queryCalls()
		.andWhere( 'identifier', params?.slug )
		.first();
	if ( ! call ) {
		return {
			notFound: true,
		};
	}
	const date = dateToString( call.created );
	let title = `Call on ${ date }`;
	if ( call.providerId ) {
		const provider = await queryRelatedProviders( call.providerId ).first();
		if ( provider ) {
			title = `Call with ${ provider.name } on ${ date }`;
		}
	}

	const meta = await queryMeta( call.id );
	const relations = await queryRelatedOfType( call.id, 'note' );
	const provider = await queryProvider( call.providerId );
	const record = rowToCall( call, { meta, relations, provider } );

	return {
		props: {
			id: call.id,
			slug: call.identifier,
			title,
			record,
		},
	};
};

export default CallPage;
