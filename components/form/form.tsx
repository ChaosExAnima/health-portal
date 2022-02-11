import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@material-ui/core';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';

import { FormProps } from './types';

export default function Form< Schema extends AnyObjectSchema >( {
	schema,
	onSubmit,
	children,
}: FormProps< Schema > ) {
	const formData = useForm< Schema >( {
		resolver: yupResolver( schema ),
	} );

	return (
		<FormProvider { ...formData }>
			<Box
				component="form"
				onSubmit={ formData.handleSubmit( onSubmit ) }
			>
				{ children }
				<Box mt={ 2 }>
					<Button type="submit" color="primary">
						Submit
					</Button>
				</Box>
			</Box>
		</FormProvider>
	);
}
