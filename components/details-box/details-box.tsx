import React, { PropsWithChildren } from 'react';
import { Box, Paper, Stack } from '@mui/material';

export default function DetailsBox( { children }: PropsWithChildren< {} > ) {
	return (
		<Paper sx={ { my: 2 } }>
			<Stack component="dl" p={ 4 } gap={ 2 }>
				{ children }
			</Stack>
		</Paper>
	);
}
