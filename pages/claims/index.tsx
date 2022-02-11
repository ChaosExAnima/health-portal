import { GetStaticPropsContext } from 'next';
import { Container } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import ProviderLink from 'components/provider-link';
import {
	formatClaimStatus,
	formatClaimType,
	formatCurrency,
	formatDate,
} from 'lib/strings';
import { CLAIM_STATUSES } from 'lib/constants';
import rowToClaim from 'lib/entities/claim';
import {
	getIdColumn,
	getIds,
	queryClaims,
	queryMeta,
	queryRelatedProviders,
} from 'lib/db/helpers';
import { getPageNumber, getTotalPageNumber } from 'lib/static-helpers';

import type { SetRequired } from 'type-fest';
import type { PageProps, StringKeys } from 'global-types';
import type { Claim, Provider } from 'lib/entities/types';

export type ClaimsProps = PageProps & {
	currentPage: number;
	totalPages: number;
	records: SetRequired< Claim, 'billed' | 'cost' | 'provider' >[];
};

const Claims: React.FC< ClaimsProps > = ( {
	currentPage,
	records,
	totalPages,
} ) => {
	const actions: ActionItem[] = [
		{
			href: '/claims/upload',
			action: 'Upload claims',
			icon: <UploadIcon />,
		},
		{
			href: '/claims/new',
			action: 'New claim',
			icon: 'add',
			color: 'secondary',
		},
	];
	const filters: DataTableFilter< StringKeys< Claim > >[] = [
		{
			key: 'type',
			label: 'Type',
			type: 'select',
			values: new Map( [
				[ 'medical', 'Medical' ],
				[ 'dental', 'Dental' ],
				[ 'pharmacy', 'Pharmacy' ],
				[ 'other', 'Other' ],
			] ),
		},
		{
			key: 'status',
			label: 'Status',
			type: 'select',
			values: new Map(
				CLAIM_STATUSES.map( ( status ) => [
					status,
					formatClaimStatus( status ),
				] )
			),
		},
	];
	const columns: DataTableColumn< StringKeys< Claim > >[] = [
		{
			align: 'right',
			key: 'date',
			name: 'Service Date',
			width: 150,
			format: formatDate( 'YYYY-MM-DD' ),
		},
		{
			key: 'number',
			name: 'Claim #',
			link: true,
			linkPrefix: '/claims/',
		},
		{
			key: 'provider',
			name: 'Provider',
			format: ( provider: Provider ) => (
				<ProviderLink color="inherit" provider={ provider } />
			),
		},
		{
			key: 'type',
			name: 'Type',
			format: formatClaimType,
		},
		{
			key: 'billed',
			name: 'Billed',
			format: formatCurrency,
		},
		{
			key: 'cost',
			name: 'Cost',
			format: formatCurrency,
		},
		{
			key: 'status',
			name: 'Status',
			format: formatClaimStatus,
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Claims" actions={ actions } />
			</Container>
			<DataTable< Claim >
				basePath="/claims"
				currentPage={ currentPage }
				totalCount={ totalPages }
				columns={ columns }
				rows={ records }
				filters={ filters }
				loading={ false }
			/>
			<Footer wrap />
		</>
	);
};

export async function getStaticProps( {
	params,
}: GetStaticPropsContext< { page: string } > ): Promise< {
	props: ClaimsProps;
} > {
	// Pagination.
	const pageSize = 20;
	const currentPage = getPageNumber( params?.page );
	const totalPages = await getTotalPageNumber( queryClaims(), pageSize );

	// Gets records.
	const claims = await queryClaims()
		.limit( pageSize )
		.offset( currentPage * pageSize );
	const meta = await queryMeta( getIds( claims ) );
	const providers = await queryRelatedProviders(
		getIdColumn( claims, 'providerId' )
	);
	const records = claims.map( ( row ) =>
		rowToClaim( row, { meta, providers } )
	);

	return {
		props: {
			title: 'Claims',
			currentPage,
			totalPages,
			records,
		},
	};
}

export default Claims;
