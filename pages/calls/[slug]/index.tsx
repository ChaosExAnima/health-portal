import dayjs from 'dayjs';

import Page from 'components/page';
import { Detail, DetailsBox } from 'components/details-box';
import ProviderLink from 'components/provider-link';
import rowToCall from 'lib/entities/call';
import {
	queryCalls,
	queryMeta,
	queryProvider,
	queryRelatedOfType,
	queryRelatedProviders,
} from 'lib/db/helpers';
import { Call } from 'lib/entities/types';
import { serialize } from 'lib/static-helpers';

import type { GetStaticPathsResult } from 'next';
import type { SetRequired } from 'type-fest';
import type {
	GetSinglePageContext,
	GetSinglePageResult,
	SinglePageProps,
} from 'global-types';

type CallWithAdditions = SetRequired< Call, 'notes' | 'reps' >;

export default function CallPage( {
	title,
	record,
}: SinglePageProps< CallWithAdditions > ) {
	const { slug, provider } = record;
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/calls', name: 'Calls' }, title ] }
			header={ {
				buttonsBelow: true,
				actions: [
					{
						action: 'Edit',
						href: `/calls/${ slug }/edit`,
						icon: 'edit',
					},
				],
			} }
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
	if ( call.providerId ) {
		const provider = await queryRelatedProviders( call.providerId ).first();
		if ( provider ) {
			title = `Call with ${ provider.name } on ${ date }`;
		}
	}

	const meta = await queryMeta( call.id );
	const relations = await queryRelatedOfType( call.id, 'note' );
	const provider = await queryProvider( call.providerId );
	const rawRecord = rowToCall( call, { meta, relations, provider } );

	return {
		props: {
			id: call.id,
			slug: call.identifier,
			title,
			record: serialize( rawRecord ),
		},
	};
}
