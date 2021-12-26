import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import AutocompleteField from 'components/autocomplete-field';
import TermField from 'components/term-field';
import { capitalize } from 'lib/strings';

import type { GetStaticProps } from 'next';
import type { PageProps } from 'global-types';

type FormValues = {
	company: number | string;
	reps: string[];
	reason: string;
	reference?: string;
	result: string;
	claims?: number[];
};

const NewCallPage: React.FC< PageProps > = () => {
	const { handleSubmit, control, register } = useForm< FormValues >();

	register( 'reps' );

	return (
		<>
			<Container maxWidth="md">
				<Box my={ 4 }>
					<Typography variant="h4" component="h1">
						Add new call
					</Typography>
				</Box>
				<Box
					component="form"
					onSubmit={ handleSubmit( ( ...args ) =>
						// eslint-disable-next-line no-console
						console.log( 'NewCallPage', ...args )
					) }
					my={ 4 }
				>
					<AutocompleteField
						name="provider"
						label="Provider"
						control={ control }
						free
					/>
					<TermField
						control={ control }
						name="reps"
						label="Representatives"
						format={ capitalize }
						fullWidth
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
								fullWidth
								required
							/>
						) }
					/>
					<Controller
						control={ control }
						name="reference"
						defaultValue=""
						render={ ( { field } ) => (
							<TextField
								{ ...field }
								label="Reference #"
								fullWidth
							/>
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
								fullWidth
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
};

export const getStaticProps: GetStaticProps< PageProps > = async () => {
	return {
		props: {
			title: 'New call',
		},
	};
};

export default NewCallPage;
