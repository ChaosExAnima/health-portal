import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import {
	Form,
	FormTextField,
	FormAutocompleteField,
	FormDateField,
} from 'components/form';
import {
	CLAIM_STATUS_PENDING,
	CLAIM_TYPE_IN,
	CLAIM_STATUSES,
	CLAIM_TYPES,
} from 'lib/constants';
import { claimSchema } from 'lib/entities/schemas';
import { ClaimInput } from 'lib/entities/types';
import { formatClaimStatus, formatClaimType } from 'lib/strings';
import { useForm } from 'react-hook-form';
import { EntityFormProps } from './types';

export default function ClaimForm( { saved }: EntityFormProps< ClaimInput > ) {
	const { control, handleSubmit } = useForm( {
		resolver: yupResolver( claimSchema ),
		defaultValues: {
			created: new Date(),
			status: CLAIM_STATUS_PENDING,
			type: CLAIM_TYPE_IN,
			...saved,
		},
	} );
	return (
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
	);
}
