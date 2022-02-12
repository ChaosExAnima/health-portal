import { Box, Typography } from '@mui/material';

type ErrorNoticeProps = {
	errors: string[];
	force?: boolean;
};

export default function ErrorNotice( { errors, force }: ErrorNoticeProps ) {
	if ( errors.length === 0 && force === undefined ) {
		return null;
	}
	return (
		<Box bgcolor="error.main">
			{ errors.length > 1 && (
				<Typography component="h1" variant="h3">
					There are { errors.length } errors:
				</Typography>
			) }
			{ errors.map( ( error ) => (
				<Typography key={ error } component="p">
					{ error }
				</Typography>
			) ) }
		</Box>
	);
}
