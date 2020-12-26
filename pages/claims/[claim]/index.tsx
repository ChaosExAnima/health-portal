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
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import ButtonLink from 'components/button-link';
import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import Link from 'components/link';
import { initializeApollo } from 'lib/apollo';
import {
	Claim,
	ClaimDocument,
	ClaimQuery,
	ClaimQueryVariables,
	ClaimsSlugsDocument,
	ClaimsSlugsQuery,
} from 'lib/apollo/queries/claims.graphql';
import { staticPathsNoData } from 'lib/static-helpers';
import numberFormat from 'lib/number-format';
import { claimStatus } from 'lib/strings';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { PageProps } from 'global-types';

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	actionButtons: {
		marginTop: theme.spacing( 2 ),
	},
	detailsContainer: {
		padding: theme.spacing( 2 ),
	},
	detailsName: {
		minWidth: 200,
	},
} ) );

export type ClaimPageProps = PageProps & {
	claim: Claim;
};

const ClaimPage: React.FC<ClaimPageProps> = ( { claim } ) => {
	const classes = useStyles();
	if ( ! claim ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Box my={ 2 }>
				<Breadcrumbs aria-label="breadcrumb">
					<Link color="inherit" href="/claims">Claims</Link>
					<Typography color="textPrimary">{ claim.claim }</Typography>
				</Breadcrumbs>
			</Box>
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					Claim # { claim.claim }
				</Typography>
				<Grid container spacing={ 2 } className={ classes.actionButtons }>
					<Grid item>
						<Button color="primary" startIcon={ <AddIcon /> }>Add Event</Button>
					</Grid>
					<Grid item>
						<ButtonLink href={ `/claims/${ claim.slug }/edit` } color="primary" startIcon={ <EditIcon /> }>Edit</ButtonLink>
					</Grid>
				</Grid>
			</Box>
			<Box my={ 4 }>
				<Grid component={ Paper } container className={ classes.detailsContainer } spacing={ 2 }>
					<DetailsRow name="Status" detail={ claimStatus( claim.status ) } />
					<DetailsRow name="Date of service" detail={ claim.date } />
					<DetailsRow name="Provider" detail={
						<>
							<ProviderLink provider={ claim.provider } color="inherit" />
							{/* TODO: Indicate whether provider is in network or not */}
						</>
					} />
					<DetailsRow name="Amount billed" detail={ numberFormat( claim.billed || 0, true ) } />
					<DetailsRow name="You owe" detail={ numberFormat( claim.cost || 0, true ) } />
					{/* TODO: Indicate if this has been paid, with ability to add a payment */}
					<DetailsRow name="You are owed" detail={ numberFormat( claim.owed || 0, true ) } />
				</Grid>
			</Box>
			<Box my={ 4 }>
				<HistoryTable type="claim" id={ claim.id } />
			</Box>
		</Container>
	);
};

const DetailsRow: React.FC<{ name: React.ReactNode, detail: React.ReactNode }> = ( { name, detail: status } ) => {
	const classes = useStyles();
	return (
		<Grid container item>
			<Grid item className={ classes.detailsName }>
				<Typography variant="body1">
					{ name }
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="body1">
					{ status }
				</Typography>
			</Grid>
		</Grid>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const client = initializeApollo();
	const { data } = await client.query<ClaimsSlugsQuery>( { query: ClaimsSlugsDocument } );
	return staticPathsNoData( data ) || {
		paths: data.getClaims.claims.map( ( claim ) => claim && `/claims/${ claim.claim }` ),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps<ClaimPageProps> = async () => {
	const client = initializeApollo();
	const { data } = await client.query<ClaimQuery, ClaimQueryVariables>( { query: ClaimDocument, variables: { slug: '123456' } } );
	return {
		props: {
			title: data.claim.claim ? `Claim # ${ data.claim.claim }` : 'Claim',
			claim: data.claim,
		},
	};
};

export default ClaimPage;
