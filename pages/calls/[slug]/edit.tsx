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
import Page from 'components/page';
import { callSchema } from 'lib/entities/schemas';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import {
	CallWithAdditions,
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from './index';

import type { Call, CallInput } from 'lib/entities/types';
import type { GetStaticPathsResult } from 'next';
import type {
	GetSingleEditPageResult,
	GetSinglePageContext,
	SingleEditPageProps,
} from 'pages/types';

function CallEditPage( {
	record,
	originalTitle,
}: SingleEditPageProps< Call > ) {
	const { control, handleSubmit } = useForm< CallInput >( {
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

export async function getStaticPaths(
	context: GetSinglePageContext
): Promise< GetStaticPathsResult > {
	return staticPathsEdit( getRootStaticPaths, context );
}

export async function getStaticProps(
	context: GetSinglePageContext
): Promise< GetSingleEditPageResult< CallWithAdditions > > {
	return staticPropsEdit< CallWithAdditions >( getRootStaticProps, context );
}

export default CallEditPage;
