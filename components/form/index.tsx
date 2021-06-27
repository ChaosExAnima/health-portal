import React from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';

type FormField = {
	type?: React.InputHTMLAttributes< unknown >[ 'type' ];
	label: string;
	initial?: string;
	required?: boolean;
	multiline?: boolean;
};

type FormProps = {
	header?: string;
	fields: Record< string, FormField >;
	onSubmit: ( values: Record< string, string > ) => void | Promise< void >;
};

const Form: React.FC< FormProps > = ( { header, fields, onSubmit } ) => {
	const initialValues: Record< string, string > = Object.entries(
		fields
	).reduce(
		( obj, [ key, { initial } ] ) => ( { ...obj, [ key ]: initial || '' } ),
		{}
	);
	const formik = useFormik( {
		initialValues,
		onSubmit,
	} );
	return (
		<form onSubmit={ formik.handleSubmit }>
			{ header && (
				<Box my={ 4 }>
					<Typography variant="h4" component="h1">
						{ header }
					</Typography>
				</Box>
			) }

			{ Object.entries( fields ).map(
				( [ name, { type = 'text', label, required, multiline } ] ) => (
					<Box my={ 4 } key={ name }>
						<TextField
							name={ name }
							type={ type }
							label={ label }
							value={ formik.values[ name ] }
							onChange={ formik.handleChange }
							required={ required }
							multiline={ multiline }
							error={
								formik.touched[ name ] &&
								Boolean( formik.errors[ name ] )
							}
							helperText={
								formik.touched[ name ] && formik.errors[ name ]
							}
							InputLabelProps={ {
								shrink: 'datetime-local' === type || undefined,
							} }
							fullWidth
						/>
					</Box>
				)
			) }

			<Box my={ 4 }>
				<Button color="primary" onClick={ formik.submitForm }>
					Submit
				</Button>
			</Box>
		</form>
	);
};

export default Form;
