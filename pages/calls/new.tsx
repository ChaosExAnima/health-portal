import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DevTool } from '@hookform/devtools';
import { capitalize } from 'lodash';

import ErrorNotice from 'components/error-notice';
import {
	Form,
	FormAutocompleteField,
	FormDateTimeField,
	FormTermsField,
	FormTextField,
} from 'components/form';
import Header from 'components/header';
import { formatErrors, handleNewType } from 'lib/api/new';
import { callSchema, NewCallInput } from 'lib/entities/call';

import type { GetStaticProps } from 'next';
import type { PageProps } from 'global-types';
import type { ErrorHandler } from 'lib/api/types';

const transformForm = (
	value: Omit< NewCallInput, 'provider' > & {
		provider: { id: number; value: string };
	}
): NewCallInput => ( {
	...value,
	provider: {
		id: value.provider.id,
		name: value.provider.value,
	},
} );

function NewCallPage() {
	const { control, handleSubmit } = useForm< NewCallInput >( {
		resolver: yupResolver( callSchema.transform( transformForm ) ),
	} );
	const [ errors, setErrors ] = useState< string[] >( [] );
	const router = useRouter();

	const handleErrors: ErrorHandler = ( errs ) =>
		setErrors( formatErrors( errs ) );

	return (
		<>
			<Container maxWidth="sm">
				<Header title="Add new call" />
				<ErrorNotice errors={ errors } />
				<Form
					onSubmit={ handleSubmit( ( form ) =>
						handleNewType( form, 'call', handleErrors, router )
					) }
				>
					<FormDateTimeField
						control={ control }
						name="date"
						label="Call Date"
						type="datetime"
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
						name="claims"
						target="claim"
						label="Linked Claims"
						multiple
					/>
				</Form>
			</Container>
			<DevTool control={ control } />
		</>
	);
}

export const getStaticProps: GetStaticProps< PageProps > = () => {
	return {
		props: {
			title: 'New call',
		},
	};
};

export default NewCallPage;
