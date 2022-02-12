import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DevTool } from '@hookform/devtools';

import AutocompleteField from 'components/autocomplete-field';
import ErrorNotice from 'components/error-notice';
import TermField from 'components/term-field';
import { formatErrors, handleNewType } from 'lib/api/new';
import { callSchema, NewCallInput } from 'lib/entities/call';
import { capitalize } from 'lib/strings';

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
	const {
		handleSubmit,
		control,
		register,
		formState: { errors: formErrors },
	} = useForm< NewCallInput >( {
		resolver: yupResolver( callSchema.transform( transformForm ) ),
	} );
	const [ errors, setErrors ] = useState< string[] >( [] );
	const router = useRouter();

	const handleErrors: ErrorHandler = ( errs ) =>
		setErrors( formatErrors( errs ) );

	register( 'reps' );
	console.log( formErrors );

	return (
		<>
			<Container maxWidth="md">
				<Box my={ 4 }>
					<Typography variant="h4" component="h1">
						Add new call
					</Typography>
				</Box>
				<ErrorNotice errors={ errors } />
				<Box
					component="form"
					onSubmit={ handleSubmit( ( form ) =>
						handleNewType( form, 'call', handleErrors, router )
					) }
					my={ 4 }
				>
					<Controller
						control={ control }
						name="date"
						rules={ { required: true } }
						render={ ( { field } ) => (
							<TextField
								{ ...field }
								label="Date"
								type="datetime-local"
								required
								InputLabelProps={ { shrink: true } }
							/>
						) }
					/>
					<AutocompleteField
						name="provider"
						label="Provider"
						control={ control }
						free
					/>
					{ formErrors.provider?.id && 'Invalid company' }
					{ formErrors.provider?.name && 'Invalid company name' }
					<TermField
						control={ control }
						name="reps"
						label="Representatives"
						format={ capitalize }
					/>
					<Controller
						control={ control }
						name="reason"
						rules={ { required: true } }
						render={ ( { field } ) => (
							<TextField
								{ ...field }
								label="Reason"
								multiline
								required
							/>
						) }
					/>
					<Controller
						control={ control }
						name="reference"
						defaultValue=""
						render={ ( { field } ) => (
							<TextField { ...field } label="Reference #" />
						) }
					/>
					<Controller
						control={ control }
						name="result"
						rules={ { required: true } }
						render={ ( { field } ) => (
							<TextField
								{ ...field }
								label="Result"
								multiline
								required
							/>
						) }
					/>
					<AutocompleteField
						name="claims"
						target="claim"
						label="Linked Claims"
						control={ control }
						multiple
					/>
					<Box mt={ 2 }>
						<Button type="submit" color="primary">
							Submit
						</Button>
					</Box>
				</Box>
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
