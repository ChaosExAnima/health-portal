import { Container } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import {
	formatClaimStatus,
	formatClaimType,
	formatCurrency,
	formatDate,
} from 'lib/strings';

import type { PageProps } from 'global-types';
import getDB from 'lib/db';
import {
	CONTENT_CLAIM,
	TABLE_CONTENT,
	TABLE_META,
	TABLE_PROVIDERS,
} from 'lib/constants';
import contentToClaim from 'lib/entities/claim';
import { Claim, Provider } from 'lib/entities/types';
import Link from 'components/link';
import { isProvider } from 'lib/entities/provider';

export type ClaimsProps = PageProps & {
	currentPage: number;
	totalPages: number;
	records: Claim[];
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
	const filters: DataTableFilter[] = [
		{
			key: 'type',
			label: 'Type',
			type: 'select',
			values: {
				MEDICAL: 'Medical',
				DENTAL: 'Dental',
				PHARMACY: 'Pharmacy',
				OTHER: 'Other',
			},
		},
		{
			key: 'status',
			label: 'Status',
			type: 'select',
			values: {
				PAID: 'Paid',
				APPROVED: 'Approved',
				PENDING: 'Pending',
				DENIED: 'Denied',
				DELETED: 'Deleted',
			},
		},
	];
	const columns: DataTableColumn< keyof Claim >[] = [
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
		},
		{
			key: 'provider',
			name: 'Provider',
			format: ( value: Provider | unknown ): React.ReactNode => {
				if ( ! isProvider( value ) ) {
					return null;
				}
				return (
					<Link href={ `/providers/${ value.slug }` }>
						{ value.name }
					</Link>
				);
			},
			link: true,
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

export async function getStaticProps(): Promise< { props: ClaimsProps } > {
	const knex = getDB();
	const rows = await knex( TABLE_CONTENT )
		.where( 'type', CONTENT_CLAIM )
		.limit( 100 );
	const meta = await knex( TABLE_META ).whereIn(
		'contentId',
		rows.map( ( { id } ) => id )
	);
	const providers = await knex( TABLE_PROVIDERS ).whereIn(
		'id',
		rows.map( ( { providerId } ) => providerId )
	);
	const records = rows.map( ( row ) =>
		contentToClaim( row, { meta, providers } )
	);

	return {
		props: {
			title: 'Claims',
			currentPage: 1,
			totalPages: 1,
			records,
		},
	};
}

export default Claims;
