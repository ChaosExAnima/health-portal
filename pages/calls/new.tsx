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
import { Autocomplete } from '@material-ui/lab';
import dayjs from 'dayjs';
import { uniq, without } from 'lodash';
import { useForm, Controller, Control, useController } from 'react-hook-form';

import { TABLE_CONTENT, TABLE_PROVIDERS } from 'lib/constants';
import { queryAllProviders, queryClaims } from 'lib/entities/db';

import type { GetStaticProps } from 'next';
import type { PageProps } from 'global-types';
import type { ContentDB, ProviderDB } from 'lib/db/types';

type FormValues = {
	company: number | string;
	reps: string[];
	reason: string;
	reference?: string;
	result: string;
	claims?: number[];
};
type WithControl< Props = Record< string, unknown > > = Props & {
	control: Control< FormValues >;
};

type Provider = {
	id?: number;
	name: string;
};
type Claim = {
	id: number;
	name: string;
};
type NewCallProps = PageProps & {
	providers: Provider[];
	claims: Claim[];
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

const CompanyField: React.FC<
	WithControl< {
		options: Provider[];
	} >
> = ( { options, control } ) => {
	const { field } = useController( {
		name: 'company',
		control,
		rules: { required: true },
	} );
	return (
		<Autocomplete
			options={ options.map( ( { name: optionName } ) => optionName ) }
			renderInput={ ( params ) => (
				<TextField
					{ ...params }
					{ ...field }
					label="Provider"
					required
				/>
			) }
			freeSolo
		/>
	);
};

const RepField: React.FC< WithControl > = ( { control } ) => {
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
				setReps( uniq( [ ...reps, value ] ) );
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

const ClaimsField: React.FC< WithControl< { claims: Claim[] } > > = ( {
	claims,
	control,
} ) => {
	return (
		<Controller
			control={ control }
			name="claims"
			render={ ( { field } ) => (
				<Autocomplete
					options={ claims }
					getOptionLabel={ ( { name } ) => name }
					renderInput={ ( params ) => (
						<TextField
							{ ...params }
							{ ...field }
							label="Claims"
							fullWidth
							margin="normal"
						/>
					) }
				/>
			) }
		/>
	);
};

const NewCallPage: React.FC< NewCallProps > = ( { providers, claims } ) => {
	const { handleSubmit, control } = useForm< FormValues >();
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					Add new call
				</Typography>
			</Box>
			<form
				// eslint-disable-next-line no-console
				onSubmit={ handleSubmit( console.log ) }
				noValidate
				autoComplete="off"
			>
				<CompanyField options={ providers } control={ control } />
				<RepField control={ control } />
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
				<ClaimsField claims={ claims } control={ control } />
				<Box mt={ 2 }>
					<Button type="submit" color="primary">
						Submit
					</Button>
				</Box>
			</form>
		</Container>
	);
};

export const getStaticProps: GetStaticProps< NewCallProps > = async () => {
	const claims: ( ContentDB & ProviderDB )[] = await queryClaims()
		.select(
			`${ TABLE_CONTENT }.id`,
			`${ TABLE_CONTENT }.identifier`,
			`${ TABLE_CONTENT }.created`,
			`${ TABLE_PROVIDERS }.name`
		)
		.orderBy( 'created', 'desc' )
		.join(
			TABLE_PROVIDERS,
			`${ TABLE_CONTENT }.providerId`,
			`${ TABLE_PROVIDERS }.id`
		);
	const providers = await queryAllProviders();
	return {
		props: {
			title: 'New call',
			providers: providers.map( ( { id, name } ) => ( { id, name } ) ),
			claims: claims.map( ( { id, identifier, created, name } ) => ( {
				id,
				name: `${ dayjs( created ).format(
					'M/D/YYYY'
				) } - ${ name } - ${ identifier }`,
			} ) ),
		},
	};
};

export default NewCallPage;
