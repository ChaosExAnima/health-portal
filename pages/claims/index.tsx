import { Container } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';

import DataTable, {
	DataTableColumn,
	DataTableFilter,
} from 'components/data-table';
import Footer from 'components/footer';
import Header, { ActionItem } from 'components/header';
import { capitalize, formatClaimType } from 'lib/strings';

import type { PageProps } from 'global-types';

type Claim = {
	id: number;
	slug: string;
	date: Date;
	claim: string;
	provider: {
		name: string;
		slug: string;
	};
	type: string;
	billed: number;
	cost: number;
	status: string;
};

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
	const columns: DataTableColumn[] = [
		{
			align: 'right',
			key: 'date',
			name: 'Service Date',
			width: 150,
		},
		{
			key: 'claim',
			name: 'Claim #',
			link: true,
		},
		{
			key: 'provider',
			name: 'Provider',
		},
		{
			key: 'type',
			name: 'Type',
			format: formatClaimType,
		},
		{
			key: 'billed',
			name: 'Billed',
			format: 'currency',
		},
		{
			key: 'cost',
			name: 'Cost',
			format: 'currency',
		},
		{
			key: 'status',
			name: 'Status',
			format: capitalize,
		},
	];

	return (
		<>
			<Container maxWidth="md">
				<Header title="Claims" actions={ actions } />
			</Container>
			<DataTable
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
	return {
		props: {
			title: 'Claims',
			currentPage: 1,
			totalPages: 1,
			records: [],
		},
	};
}

export default Claims;
