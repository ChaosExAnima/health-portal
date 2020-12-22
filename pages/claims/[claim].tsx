import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import {
	Box,
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
import ConnectionIcon from '@material-ui/icons/Link';
import PaymentIcon from '@material-ui/icons/Payment';

import HistoryTable from 'components/history-table';
import ProviderLink from 'components/provider-link';
import { staticPathsNoData } from 'lib/static-helpers';
import { getClient } from 'lib/apollo';
import numberFormat from 'lib/number-format';

import type { ClaimRow, PageProps } from 'global-types';
import type { GetStaticPaths, GetStaticProps } from 'next';

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

type ClaimPageProps = PageProps & {
	claim: ClaimRow;
};

const ClaimPage: React.FC<ClaimPageProps> = ( { claim } ) => {
	const classes = useStyles();
	if ( ! claim ) {
		return null;
	}
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					Claim # { claim.claim }
				</Typography>
				<Grid container spacing={ 2 } className={ classes.actionButtons }>
					<Grid item>
						<Button color="primary" endIcon={ <EditIcon /> }>Edit</Button>
					</Grid>
					<Grid item>
						<Button color="primary" endIcon={ <ConnectionIcon /> }>Add connection</Button>
					</Grid>
					<Grid item>
						<Button color="primary" endIcon={ <PaymentIcon /> }>Add payment</Button>
					</Grid>
				</Grid>
			</Box>
			<Box my={ 4 }>
				<Grid component={ Paper } container className={ classes.detailsContainer } spacing={ 2 }>
					<DetailsRow name="Status" detail={ claim.status } />
					<DetailsRow name="Date of service" detail={ dayjs( Number.parseInt( claim.date ) ).format( 'd/m/YYYY' ) } />
					<DetailsRow name="Provider" detail={
						<>
							<ProviderLink provider={ claim.provider } />
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
				<HistoryTable />
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
