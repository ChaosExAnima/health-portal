import { Box, Button } from '@material-ui/core';
import React from 'react';
import { AnyObjectSchema } from 'yup';

import { FormProps } from './types';

export default function Form< Schema extends AnyObjectSchema >( {
	onSubmit,
	children,
}: FormProps< Schema > ) {
	return (
		<Box component="form" onSubmit={ onSubmit }>
			{ children }
			<Box mt={ 2 }>
				<Button type="submit" color="primary">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
