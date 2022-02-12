import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
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

export default function ClaimPageEdit( {
	slug,
	title,
}: SinglePageProps< ClaimWithAdditions > ) {
	if ( ! slug ) {
		return null;
	}

	return (
		<Container maxWidth="md" component="main">
			<Box my="2">
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
			<Box my="4">
				<Typography variant="h4" component="h1">
					{ title }
				</Typography>
				<Grid container spacing="2" mt="2">
					<Grid item>
						<Button color="primary" startIcon={ <SaveIcon /> }>
							Save
						</Button>
					</Grid>
					<Grid item>
						<Button startIcon={ <CancelIcon /> }>Cancel</Button>
					</Grid>
					<Grid item>
						<Button startIcon={ <DeleteIcon /> } color="error">
							Delete
						</Button>
					</Grid>
				</Grid>
			</Box>
			<Box my={ 4 }>
				<Grid component={ Paper } container p="2" spacing="2"></Grid>
			</Box>
		</Container>
	);
}

export const getStaticPaths: GetStaticPaths = async ( context ) =>
	staticPathsEdit( getRootStaticPaths, context );

export const getStaticProps: GetSinglePageProps< ClaimWithAdditions > = async (
	context
) => staticPropsEdit( getRootStaticProps, context );
