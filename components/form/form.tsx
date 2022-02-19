import { Box, Button } from '@mui/material';
import DateAdaptor from '@mui/lab/AdapterDayjs';
import { LocalizationProvider } from '@mui/lab';
import React, { useState } from 'react';

import ErrorNotice from 'components/error-notice';
import { formatErrors, handleUpdateType } from 'lib/api/new';
import { isPlainObject } from 'lib/casting';

import type { AnyObjectSchema } from 'yup';
import type { ErrorHandler } from 'lib/api/types';
import type { Slug } from 'lib/entities/types';
import type { FormProps } from './types';

export default function Form< Schema extends AnyObjectSchema >( {
	type,
	name = type,
	new: newSubmission,
	children,
	handleSubmit,
	transform,
}: FormProps< Schema > ) {
	const [ errors, setErrors ] = useState< string[] >( [] );

	if ( newSubmission ) {
		name = `new-${ type }`;
	}

	const handleErrors: ErrorHandler = ( errs ) =>
		setErrors( formatErrors( errs ) );

	const onSuccess = ( form: any ) => {
		if ( transform ) {
			form = transform( form );
		}
		if ( ! isPlainObject( form ) ) {
			return handleErrors( 'Invalid submission' );
		}
		let slug = undefined;
		if ( ! newSubmission ) {
			if ( form && 'slug' in form ) {
				slug = String( form.slug ) as Slug;
			} else {
				return handleErrors( 'No slug provided' );
			}
		}
		return handleUpdateType( form, type, handleErrors, slug );
	};
	return (
		<Box
			noValidate
			name={ name }
			component="form"
			autoComplete="off"
			onSubmit={ handleSubmit( onSuccess ) }
		>
			<ErrorNotice errors={ errors } />
			<LocalizationProvider dateAdapter={ DateAdaptor }>
				{ children }
			</LocalizationProvider>
			<Box mt={ 2 }>
				<Button type="submit" color="primary">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
