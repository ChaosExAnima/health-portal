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
} from '@material-ui/core';
import Link from 'next/link';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';

import numberFormat from 'lib/number-format';
import dateFormat from 'lib/date-format';

import type { ClaimTypes, PageProps } from 'global-types';
import { useRouter } from 'next/router';

type ClaimRow = {
	id: number;
	claim: string;
	date: number;
	provider: string;
	type: ClaimTypes;
	billed: number;
	cost: number;
	status: 'approved' | 'pending' | 'denied' | 'deleted';
};

export type ClaimsProps = PageProps & {
	rows: ClaimRow[],
	totalClaims: number;
	currentPage: number;
};

const Claims: React.FC<ClaimsProps> = ( { rows, totalClaims, currentPage } ) => {
	const router = useRouter();

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
		</Container>
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
						{ rows.map( ( { id, date, claim, provider, type, billed, cost, status } ) => (
							<TableRow key={ id }>
								<TableCell>{ dateFormat( date ) }</TableCell>
								<TableCell>{ claim }</TableCell>
								<TableCell>{ provider }</TableCell>
								<TableCell>{ type }</TableCell>
								<TableCell align="right">{ numberFormat( billed, true ) }</TableCell>
								<TableCell align="right">{ numberFormat( cost, true ) }</TableCell>
								<TableCell>{ status }</TableCell>
							</TableRow>
						) ) }
					</TableBody>
					<TablePagination
						rowsPerPage={ 100 }
						count={ totalClaims }
						page={ currentPage }
						onChangePage={ ( event, page ) => router.push( `/claims/page/${ page }` ) }
					/>
				</Table>
			</TableContainer>
		</Container>
	</>;
};

export async function getStaticProps(): Promise<{ props: ClaimsProps }> {
	return {
		props: {
			title: 'Claims',
			totalClaims: 1043,
			currentPage: 1,
			rows: [
				{
					id: 1,
					claim: '202933847338490',
					date: new Date( 2020, 1, 23 ).getTime(),
					provider: 'Dr. Jane Smith',
					type: 'in network',
					billed: 500,
					cost: 15,
					status: 'approved',
				},
				{
					id: 2,
					claim: '2020336DV3604',
					date: new Date( 2020, 4, 34 ).getTime(),
					provider: 'Dr. Jane Smith',
					type: 'in network',
					billed: 340,
					cost: 10.55,
					status: 'pending',
				},
			],
		},
	};
}

export default Claims;
