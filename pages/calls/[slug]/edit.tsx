import { Box, capitalize, Container } from '@mui/material';

import {
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from '.';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SingleEditPageProps } from 'pages/types';
import type { Call, CallInput, WithNumberIds } from 'lib/entities/types';
import Page from 'components/page';
import {
	Form,
	FormAutocompleteField,
	FormDateTimeField,
	FormTermsField,
	FormTextField,
} from 'components/form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { callSchema } from 'lib/entities/schemas';

function CallEditPage( {
	record,
	originalTitle,
}: SingleEditPageProps< Call > ) {
	const { control, handleSubmit } = useForm< WithNumberIds< CallInput > >( {
		resolver: yupResolver( callSchema ),
		defaultValues: {
			...record,
			provider: record.provider?.id,
		},
	} );
	return (
		<Page title={ originalTitle } subtitle="Editing" maxWidth="sm">
			<Form type="call" handleSubmit={ handleSubmit }>
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
		</Page>
	);
}

export const getStaticProps: GetSinglePageProps< Call > = async ( context ) =>
	staticPropsEdit( getRootStaticProps, context );

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export default CallEditPage;
