import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Form, FormTextField } from 'components/form';
import { providerSchema } from 'lib/entities/schemas';

import type { EntityFormProps } from './types';
import type { ProviderInput } from 'lib/entities/types';

export default function ProviderForm( {
	saved,
}: EntityFormProps< ProviderInput > ) {
	const { control, handleSubmit } = useForm( {
		resolver: yupResolver( providerSchema ),
		defaultValues: {
			...saved,
		},
	} );
	return (
		<Form
			handleSubmit={ handleSubmit }
			type="provider"
			new={ saved === undefined }
		>
			<FormTextField
				name="name"
				label="Name"
				required
				control={ control }
			/>
			<FormTextField
				name="address"
				label="Address"
				control={ control }
				multiline
			/>
			<FormTextField
				name="phone"
				label="Phone Num"
				type="tel"
				control={ control }
			/>
			<FormTextField
				name="email"
				label="Email"
				type="email"
				control={ control }
			/>
			<FormTextField
				name="website"
				label="Website"
				type="url"
				control={ control }
			/>
		</Form>
	);
}
