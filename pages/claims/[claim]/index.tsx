import { gql, useQuery } from '@apollo/client';
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
import { staticPathsNoData } from 'lib/static-helpers';
import { getClient } from 'lib/apollo';
import numberFormat from 'lib/number-format';
import { claimStatus } from 'lib/strings';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ClaimRow, PageProps } from 'global-types';

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
	claim: ClaimRow;
};

const ClaimPage: React.FC<ClaimPageProps> = ( { claim } ) => {
	const HISTORY_QUERY = gql`
		query ClaimHistory( $id: String! ) {
			claim(claim: $id) {
				history {
					date
					description
					type
					link {
						__typename
						... on Dispute {
							slug
						}
						... on Claim {
							slug
						}
						... on Call {
							slug
						}
					}
				}
			}
		}
	`;
	const classes = useStyles();
	const { data, loading } = useQuery( HISTORY_QUERY, { variables: { id: claim?.id } } );
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
					<DetailsRow name="Amount billed" detail={ numberFormat( claim.billed, true ) } />
					<DetailsRow name="You owe" detail={ numberFormat( claim.cost, true ) } />
					{/* TODO: Indicate if this has been paid, with ability to add a payment */}
					<DetailsRow name="You are owed" detail={ numberFormat( claim.owed, true ) } />
				</Grid>
			</Box>
			<Box my={ 4 }>
				{ loading && 'Loading!' }
				{ data && <HistoryTable events={ data.claim.history } /> }
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
	const CLAIM_SLUG_QUERY = gql`
		query {
			getClaims( limit: 10000 ) {
				claims {
					claim
				}
			}
		}
	`;

	type ClaimsSlugQuery = {
		getClaims: {
			claims: ClaimRow[];
		}
	};

	const client = getClient();
	const { data } = await client.query<ClaimsSlugQuery>( { query: CLAIM_SLUG_QUERY } );
	return staticPathsNoData( data ) || {
		paths: ( data as ClaimsSlugQuery ).getClaims.claims.map( ( { claim } ) => `/claims/${ claim }` ),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps<ClaimPageProps> = async () => {
	const CLAIM_QUERY = gql`
		query Claim( $id: String! ) {
			claim(claim: $id) {
				id
				claim
				slug
				date
				provider {
					id
					name
				}
				type
				billed
				cost
				owed
				status
			}
		}
	`;

	type ClaimQuery = {
		claim: ClaimRow;
	};
	type ClaimQueryVariables = {
		id: string;
	};

	const client = getClient();
	const { data } = await client.query<ClaimQuery, ClaimQueryVariables>( { query: CLAIM_QUERY, variables: { id: '12345' } } );
	return {
		props: {
			title: `Claim # ${ data.claim.claim }`,
			claim: data.claim,
		},
	};
};

export default ClaimPage;
