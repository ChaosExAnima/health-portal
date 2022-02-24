import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';

import {
	Form,
	FormAutocompleteField,
	FormDateField,
	FormTextField,
} from 'components/form';
import Page from 'components/page';
import {
	CLAIM_STATUSES,
	CLAIM_STATUS_PENDING,
	CLAIM_TYPES,
	CLAIM_TYPE_IN,
} from 'lib/constants';
import { claimSchema } from 'lib/entities/schemas';
import { formatClaimStatus, formatClaimType } from 'lib/strings';

import type { PageProps } from 'pages/types';

type ClaimNewPageProps = PageProps;

export default function ClaimNewPage( { title }: ClaimNewPageProps ) {
	const { control, handleSubmit } = useForm( {
		resolver: yupResolver( claimSchema ),
		defaultValues: {
			number: undefined,
			provider: undefined,
			created: new Date(),
			status: CLAIM_STATUS_PENDING,
			type: CLAIM_TYPE_IN,
			billed: undefined,
			cost: undefined,
		},
	} );
	return (
		<Page
			title={ title }
			breadcrumbs={ [ { href: '/claims', name: 'Claims' }, title ] }
			maxWidth="sm"
		>
			<Form new type="claim" handleSubmit={ handleSubmit }>
				<FormTextField
					name="number"
					label="Claim Number"
					control={ control }
					required
				/>
				<FormAutocompleteField
					name="provider"
					label="Provider"
					control={ control }
					free
					required
				/>
				<FormDateField
					name="created"
					label="Service Date"
					control={ control }
					required
				/>
				<FormTextField
					name="status"
					label="Status"
					control={ control }
					select
					required
				>
					{ CLAIM_STATUSES.map( ( status ) => (
						<MenuItem key={ status } value={ status }>
							{ formatClaimStatus( status ) }
						</MenuItem>
					) ) }
				</FormTextField>
				<FormTextField
					name="type"
					label="Claim Type"
					control={ control }
					select
					required
				>
					{ CLAIM_TYPES.map( ( type ) => (
						<MenuItem key={ type } value={ type }>
							{ formatClaimType( type ) }
						</MenuItem>
					) ) }
				</FormTextField>
				<FormTextField
					name="billed"
					label="Billed"
					control={ control }
					InputProps={ { startAdornment: '$' } }
					type="number"
				/>
				<FormTextField
					name="cost"
					label="Cost"
					control={ control }
					InputProps={ { startAdornment: '$ ' } }
				/>
			</Form>
		</Page>
	);
}

export async function getStaticProps(): Promise< {
	props: ClaimNewPageProps;
} > {
	return {
		props: {
			title: 'New Claim',
		},
	};
}
