import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import {
	ClaimWithAdditions,
	getStaticPaths as getRootStaticPaths,
	getStaticProps as getRootStaticProps,
} from '.';
import Link from 'components/link';
import { staticPathsEdit, staticPropsEdit } from 'lib/static-helpers';

import type { GetStaticPaths } from 'next';
import type { GetSinglePageProps, SinglePageProps } from 'global-types';

const PREFIX = 'ClaimPageEdit';

const classes = {
	actionButtons: `${ PREFIX }-actionButtons`,
	deleteButton: `${ PREFIX }-deleteButton`,
	detailsContainer: `${ PREFIX }-detailsContainer`,
	detailsName: `${ PREFIX }-detailsName`,
};

const StyledPage = styled( Container )( ( { theme } ) => ( {
	[ `& .${ classes.actionButtons }` ]: {
		marginTop: theme.spacing( 2 ),
	},

	[ `& .${ classes.deleteButton }` ]: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.error.light,
		},
	},

	[ `& .${ classes.detailsContainer }` ]: {
		padding: theme.spacing( 2 ),
	},

	[ `& .${ classes.detailsName }` ]: {
		minWidth: 200,
	},
} ) );

const ClaimPageEdit: React.FC< SinglePageProps< ClaimWithAdditions > > = ( {
	slug,
	title,
} ) => {
	if ( ! slug ) {
		return null;
	}

	return (
		<StyledPage maxWidth="md" as="main">
			<Box my={ 2 }>
				<Breadcrumbs aria-label="breadcrumb">
					<Link color="inherit" href="/claims">
						Claims
					</Link>
					<Link color="inherit" href={ `/claims/${ slug }` }>
						{ slug }
					</Link>
					<Typography color="textPrimary">Edit</Typography>
				</Breadcrumbs>
			</Box>
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					{ title }
				</Typography>
				<Grid
					container
					spacing={ 2 }
					className={ classes.actionButtons }
				>
					<Grid item>
						<Button color="primary" startIcon={ <SaveIcon /> }>
							Save
						</Button>
					</Grid>
					<Grid item>
						<Button startIcon={ <CancelIcon /> }>Cancel</Button>
					</Grid>
					<Grid item>
						<Button
							startIcon={ <DeleteIcon /> }
							className={ classes.deleteButton }
						>
							Delete
						</Button>
					</Grid>
				</Grid>
			</Box>
			<Box my={ 4 }>
				<Grid
					component={ Paper }
					container
					className={ classes.detailsContainer }
					spacing={ 2 }
				></Grid>
			</Box>
		</StyledPage>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetSinglePageProps< ClaimWithAdditions > = async (
	context
) => staticPropsEdit( getRootStaticProps, context );

export default ClaimPageEdit;
