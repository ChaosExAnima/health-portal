import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Form, FormAutocompleteField, FormTextField } from 'components/form';
import { appealSchema } from 'lib/entities/schemas';

import { EntityFormProps } from './types';

import type { AppealInput } from 'lib/entities/types';

export default function ClaimForm( { saved }: EntityFormProps< AppealInput > ) {
	const { control, handleSubmit } = useForm( {
		resolver: yupResolver( appealSchema ),
		defaultValues: {
			...saved,
		},
	} );
	return (
		<Form
			type="appeal"
			handleSubmit={ handleSubmit }
			new={ saved === undefined }
		>
			<FormTextField name="name" label="Name" control={ control } />
			<FormAutocompleteField
				name="provider"
				label="Provider"
				control={ control }
			/>
		</Form>
	);
}
