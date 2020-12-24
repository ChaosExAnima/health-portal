import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	createStyles,
	Grid,
	makeStyles,
	Paper,
	Theme,
	Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';

import {
	ClaimPageProps,
	getStaticPaths as getRootStaticPaths,
	getStaticProps,
} from '.';
import Link from 'components/link';

import type { GetStaticPaths } from 'next';

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	actionButtons: {
		marginTop: theme.spacing( 2 ),
	},
	deleteButton: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.error.light,
		},
	},
	detailsContainer: {
		padding: theme.spacing( 2 ),
	},
	detailsName: {
		minWidth: 200,
	},
} ) );

const ClaimPageEdit: React.FC<ClaimPageProps> = ( { claim } ) => {
	const classes = useStyles();

	if ( ! claim ) {
		return null;
	}

	return (
		<Container maxWidth="md">
			<Box my={ 2 }>
				<Breadcrumbs aria-label="breadcrumb">
					<Link color="inherit" href="/claims">Claims</Link>
					<Link color="inherit" href={ `/claims/${ claim.slug }` }>{ claim.claim }</Link>
					<Typography color="textPrimary">Edit</Typography>
				</Breadcrumbs>
			</Box>
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					Claim # { claim.claim }
				</Typography>
				<Grid container spacing={ 2 } className={ classes.actionButtons }>
					<Grid item>
						<Button color="primary" startIcon={ <SaveIcon /> }>Save</Button>
					</Grid>
					<Grid item>
						<Button startIcon={ <CancelIcon /> }>Cancel</Button>
					</Grid>
					<Grid item>
						<Button startIcon={ <DeleteIcon /> } className={ classes.deleteButton }>Delete</Button>
					</Grid>
				</Grid>
			</Box>
			<Box my={ 4 }>
				<Grid component={ Paper } container className={ classes.detailsContainer } spacing={ 2 }>
				</Grid>
			</Box>
		</Container>
	);
};

export const getStaticPaths: GetStaticPaths = async ( context ) => {
	const rootStaticPaths = await getRootStaticPaths( context );
	if ( Array.isArray( rootStaticPaths.paths ) ) {
		rootStaticPaths.paths = rootStaticPaths.paths.map( ( path ) => `${ path }/edit` );
	}
	return rootStaticPaths;
};

export { getStaticProps };

export default ClaimPageEdit;
