import { yupResolver } from '@hookform/resolvers/yup';
import { capitalize } from 'lodash';
import { useForm } from 'react-hook-form';

import {
	Form,
	FormAutocompleteField,
	FormDateTimeField,
	FormTermsField,
	FormTextField,
} from 'components/form';
import { callSchema } from 'lib/entities/schemas';
import { CallInput } from 'lib/entities/types';

import { EntityFormProps } from './types';

export default function CallForm( { saved }: EntityFormProps< CallInput > ) {
	const { control, handleSubmit } = useForm< CallInput >( {
		resolver: yupResolver( callSchema ),
		defaultValues: saved,
	} );
	return (
		<Form
			handleSubmit={ handleSubmit }
			type="call"
			new={ saved === undefined }
		>
			<FormDateTimeField
				control={ control }
				name="created"
				label="Call Date"
				required
				disableFuture
				showTodayButton
			/>
			<FormAutocompleteField
				control={ control }
				name="provider"
				label="Provider"
				free
				required
			/>
			<FormTermsField
				control={ control }
				name="reps"
				label="Representatives"
				format={ capitalize }
			/>
			<FormTextField
				control={ control }
				name="reason"
				label="Reason"
				multiline
				required
			/>
			<FormTextField
				control={ control }
				name="reference"
				label="Reference #"
			/>
			<FormTextField
				control={ control }
				name="result"
				label="Result"
				multiline
				required
			/>
			<FormAutocompleteField
				control={ control }
				name="links"
				target="claim"
				label="Linked Claims"
				multiple
			/>
		</Form>
	);
}
