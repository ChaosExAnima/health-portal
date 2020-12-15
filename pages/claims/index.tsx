import {
	Container,
	Box,
	Grid,
	Fab,
	Typography,
	Table,
	TableContainer,
	Paper,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	TablePagination,
	LinearProgress,
} from '@material-ui/core';
import Link from 'next/link';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';

import numberFormat from 'lib/number-format';
import dateFormat from 'lib/date-format';
import { claimType, claimStatus } from 'lib/strings';

import type { ClaimTypes, PageProps } from 'global-types';

type ClaimRow = {
	id: number;
	claim: string;
	date: string;
	provider: {
		id: string;
		name: string;
	};
	type: ClaimTypes;
	billed: number;
	cost: number;
	status: 'approved' | 'pending' | 'denied' | 'deleted';
};

export type ClaimsProps = PageProps & {
	currentPage: number;
};

type ClaimsTableProps = {
	claims: ClaimRow[];
	totalCount: number;
	currentPage: number;
};

const CLAIMS_QUERY = gql`
	query Claims($offset: Int!) {
		getClaims(offset: $offset) {
			totalCount
			claims {
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
				status
			}
		}
	}
`;

const ClaimsTable: React.FC<ClaimsTableProps> = ( { claims, totalCount, currentPage } ) => {
	const router = useRouter();
	return (
		<Container maxWidth="lg">
			<TableContainer component={ Paper }>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Service Date</TableCell>
							<TableCell>Claim #</TableCell>
							<TableCell>Provider</TableCell>
							<TableCell>Type</TableCell>
							<TableCell align="right">Billed</TableCell>
							<TableCell align="right">Your Cost</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ claims.map( ( { id, date, claim, provider, type, billed, cost, status }: ClaimRow ) => (
							<TableRow key={ id }>
								<TableCell>{ dateFormat( Number.parseInt( date ) ) }</TableCell>
								<TableCell>{ claim }</TableCell>
								<TableCell>{ provider.name }</TableCell>
								<TableCell>{ claimType( type ) }</TableCell>
								<TableCell align="right">{ numberFormat( billed, true ) }</TableCell>
								<TableCell align="right">{ numberFormat( cost, true ) }</TableCell>
								<TableCell>{ claimStatus( status ) }</TableCell>
							</TableRow>
						) ) }
					</TableBody>
					<TablePagination
						rowsPerPage={ 20 }
						rowsPerPageOptions={ [ 20 ] }
						count={ totalCount }
						page={ currentPage }
						onChangePage={ ( event, page ) => router.push( `/claims/page/${ page + 1 }` ) }
					/>
				</Table>
			</TableContainer>
		</Container>
	);
};

const Claims: React.FC<ClaimsProps> = ( { currentPage } ) => {
	const { loading, data } = useQuery( CLAIMS_QUERY, { variables: { offset: currentPage * 20 } } );

	return <>
		<Container maxWidth="md">
			<Box my={ 4 }>
				<Grid container spacing={ 4 }>
					<Grid item>
						<Typography variant="h4" component="h1">
							Claims
						</Typography>
					</Grid>
					<Grid item>
						<Link href="/claims/upload">
							<Fab color="primary" aria-label="Upload Claims">
								<CloudUploadIcon />
							</Fab>
						</Link>
					</Grid>
					<Grid item>
						<Link href="/claims/new">
							<Fab color="secondary" aria-label="Add Claim">
								<AddIcon />
							</Fab>
						</Link>
					</Grid>
				</Grid>
			</Box>
			{ loading && <Box my={ 4 }><LinearProgress /></Box> }
		</Container>
		{ data && <ClaimsTable
			totalCount={ data.getClaims.totalCount }
			claims={ data.getClaims.claims }
			currentPage={ currentPage }
		/> }
		<Footer />
	</>;
};

export async function getStaticProps(): Promise<{ props: ClaimsProps }> {
	return {
		props: {
			title: 'Claims',
			currentPage: 0,
		},
	};
}

export default Claims;
