import { DevTool } from '@hookform/devtools';
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
import { CallInput } from 'lib/entities/types';

import type { GetStaticProps } from 'next';
import type { PageProps } from 'pages/types';

function NewCallPage( { title }: PageProps ) {
	const { control, handleSubmit } = useForm< CallInput >( {
		resolver: yupResolver( callSchema ),
	} );
	return (
		<>
			<Page
				title={ title }
				maxWidth="sm"
				breadcrumbs={ [ { href: '/calls', name: 'Calls' }, title ] }
			>
				<Form handleSubmit={ handleSubmit } type="call" new>
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
