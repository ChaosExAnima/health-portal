import { useState } from 'react';
import {
	Box,
	Button,
	Chip,
	Container,
	createStyles,
	makeStyles,
	TextField,
	Theme,
	Typography,
} from '@material-ui/core';
import { uniq, without } from 'lodash';
import { useForm, Controller, UseFormSetValue } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import AutocompleteField from 'components/autocomplete-field';

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

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		reps: {
			display: 'flex',
			gap: theme.spacing( 2 ),
		},
		missing: {
			fontStyle: 'oblique',
		},
	} )
);

const RepField: React.FC< {
	setFormValue: UseFormSetValue< FormValues >;
} > = ( { setFormValue } ) => {
	const [ reps, setReps ] = useState< string[] >( [] );
	const [ value, setValue ] = useState< string >( '' );

	const classes = useStyles();

	const onChangeField = (
		event: React.KeyboardEvent< HTMLInputElement >
	) => {
		switch ( event.key ) {
			case 'Enter':
			case ',':
				event.preventDefault();
				const newReps = uniq( [ ...reps, value ] );
				setReps( newReps );
				setFormValue( 'reps', newReps, { shouldValidate: true } );
				setValue( '' );
				break;
			case 'Escape':
				setValue( '' );
				break;
		}
	};

	return (
		<>
			<Box className={ classes.reps } mt={ 2 }>
				{ reps.map( ( rep ) => (
					<Chip
						key={ rep }
						label={ rep }
						onDelete={ () => setReps( without( reps, rep ) ) }
					/>
				) ) }
				{ ! reps.length && (
					<Typography variant="body1" className={ classes.missing }>
						No representatives yet
					</Typography>
				) }
			</Box>
			<TextField
				label="Representative"
				onKeyDown={ onChangeField }
				value={ value }
				onChange={ ( val ) => setValue( val.target.value ) }
				fullWidth
				margin="normal"
			/>
		</>
	);
};

const NewCallPage: React.FC< PageProps > = () => {
	const {
		handleSubmit,
		control,
		register,
		setValue,
	} = useForm< FormValues >();

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
					<RepField setFormValue={ setValue } />
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
								margin="normal"
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
								margin="normal"
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
								margin="normal"
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
