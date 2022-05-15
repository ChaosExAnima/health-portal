import { Box, Paper, Stack } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export default function DetailsBox( { children }: PropsWithChildren< {} > ) {
	return (
		<Paper sx={ { my: 2 } }>
			<Stack component="dl" p={ 4 } gap={ 2 }>
				{ children }
			</Stack>
		</Paper>
	);
}
