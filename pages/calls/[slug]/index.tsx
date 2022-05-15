import dayjs from 'dayjs';

import { Detail, DetailsBox } from 'components/details-box';
import Page from 'components/page';
import ProviderLink from 'components/provider-link';
import {
	queryCalls,
	queryMeta,
	queryProvider,
	queryRelatedOfType,
} from 'lib/db/helpers';
import { rowToCall } from 'lib/entities/call';

import type { Call } from 'lib/entities/types';
import type { GetStaticPathsResult } from 'next';
import type {
	GetSinglePageContext,
	GetSinglePageResult,
	SinglePageProps,
} from 'pages/types';
import type { SetRequired } from 'type-fest';

export type CallWithAdditions = SetRequired< Call, 'notes' | 'reps' >;

export default function CallPage( {
	title,
	record,
}: SinglePageProps< CallWithAdditions > ) {
	const { slug, provider } = record;
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/calls', name: 'Calls' }, title ] }
			buttonsBelow
			actions={ [
				{
					action: 'Edit',
					href: `/calls/${ slug }/edit`,
					icon: 'edit',
				},
			] }
		>
			<DetailsBox>
				<Detail label="Provider" placeholder="None found">
					{ provider && <ProviderLink provider={ provider } /> }
				</Detail>
				<Detail label="Reps">{ record.reps.join( ', ' ) }</Detail>
				<Detail label="Reason">{ record.reason }</Detail>
				<Detail label="Result">{ record.result }</Detail>
				<Detail label="Reference">{ record.reference }</Detail>
			</DetailsBox>
		</Page>
	);
}

export async function getStaticPaths(): Promise< GetStaticPathsResult > {
	const claims = await queryCalls().select( 'identifier' );
	return {
		paths: claims.map(
			( { identifier } ) => `/calls/${ identifier.toLowerCase() }`
		),
		fallback: false,
	};
}

export async function getStaticProps( {
	params,
}: GetSinglePageContext ): GetSinglePageResult< CallWithAdditions > {
	const call = await queryCalls()
		.andWhere( 'identifier', params?.slug )
		.first();
	if ( ! call ) {
		return {
			notFound: true,
		};
	}
	const date = dayjs( call.created ).format( 'M/D/YY' );
	let title = `Call on ${ date }`;
	const provider = call.providerId
		? await queryProvider( call.providerId )
		: undefined;
	if ( provider ) {
		title = `Call with ${ provider.name } on ${ date }`;
	}

	const meta = await queryMeta( call.id );
	const relations = await queryRelatedOfType( call.id, 'note' );
	const record = rowToCall( call, { meta, relations, provider } );

	return {
		props: {
			id: call.id,
			slug: call.identifier,
			title,
			record,
		},
	};
}
