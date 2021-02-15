import {
	Box,
	Paper,
	Grid,
	makeStyles,
	Theme,
	createStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';

type Detail = {
	name: React.ReactNode;
	detail: React.ReactNode;
	empty?: React.ReactNode;
}

type DetailsBoxProps = {
	details: Detail[];
};

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	detailsContainer: {
		padding: theme.spacing( 2 ),
	},
	detailsName: {
		minWidth: 200,
	},
} ) );

const DetailsBox: React.FC<DetailsBoxProps> = ( { details } ) => {
	const classes = useStyles();
	return (
		<Box my={ 4 }>
			<Grid component={ Paper } container className={ classes.detailsContainer } spacing={ 2 }>
				{ details.map( ( { name, detail: status, empty = 'Unknown' }, index ) => (
					<Grid container item key={ index }>
						<Grid item className={ classes.detailsName }>
							<Typography variant="body1">
								{ name }
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1" color={ status ? 'textPrimary' : 'textSecondary' }>
								{ status || empty }
							</Typography>
						</Grid>
					</Grid>
				) ) }
			</Grid>
		</Box>
	);
};

export default DetailsBox;
