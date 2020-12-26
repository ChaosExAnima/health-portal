import { Container } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';

import Header, { ActionItem } from 'components/header';
import Footer from 'components/footer';
import { useClaimsIndexQuery } from 'lib/apollo/queries/claims.graphql';

import type { PageProps } from 'global-types';
import DataTable, { DataTableColumn, DataTableFilter } from 'components/data-table';
import { capitalize, claimType } from 'lib/strings';

export type ClaimsProps = PageProps & {
	currentPage: number;
};

const Claims: React.FC<ClaimsProps> = ( { currentPage } ) => {
	const { loading, data } = useClaimsIndexQuery( { variables: { offset: currentPage * 20 } } );

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
			format: 'date',
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
			format: claimType,
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

	return <>
		<Container maxWidth="md">
			<Header title="Claims" actions={ actions } />
		</Container>
		<DataTable
			basePath="/claims"
			currentPage={ currentPage }
			totalCount={ data?.getClaims.totalCount }
			columns={ columns }
			rows={ data?.getClaims.claims }
			filters={ filters }
			loading={ loading }
		/>
		<Footer wrap />
	</>;
};

export async function getStaticProps(): Promise<{ props: ClaimsProps }> {
	return {
		props: {
			title: 'Claims',
			currentPage: 0,
		},
	};
}

export default Claims;
