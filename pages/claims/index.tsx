import {
	Container,
	Box,
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
	TableFooter,
	Toolbar,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	makeStyles,
	Theme,
	createStyles,
	TextField,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { useClaimsIndexQuery, Claim } from './queries.graphql';
import Header, { ActionItem } from 'components/header';
import TextLink from 'components/link';
import Footer from 'components/footer';
import ProviderLink from 'components/provider-link';
import numberFormat from 'lib/number-format';
import { claimType, claimStatus } from 'lib/strings';

import type { PageProps } from 'global-types';

export type ClaimsProps = PageProps & {
	currentPage: number;
};

type ClaimsTableProps = {
	claims: Claim[];
	totalCount: number;
	currentPage: number;
};

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	formControl: {
		margin: theme.spacing( 1 ),
		minWidth: 120,
	},
	filterHeader: {
		marginRight: theme.spacing( 6 ),
	},
} ) );

const ClaimsTableHeader: React.FC = () => {
	const classes = useStyles();
	const today = dayjs();
	const monthStart = dayjs().startOf( 'month' );
	return (
		<Toolbar>
			<Typography variant="h5" component="p" className={ classes.filterHeader }>
				Filter
				<FilterListIcon />
			</Typography>
			<TextField
				id="claims-range-start"
				label="Service Start Date"
				type="date"
				defaultValue={ monthStart.format( 'YYYY-MM-DD' ) }
				className={ classes.formControl }
				InputLabelProps={ {
					shrink: true,
				} }
			/>
			<TextField
				id="claims-range-end"
				label="Service Start Date"
				type="date"
				defaultValue={ today.format( 'YYYY-MM-DD' ) }
				className={ classes.formControl }
				InputLabelProps={ {
					shrink: true,
				} }
			/>
			<FormControl className={ classes.formControl }>
				<InputLabel id="claims-type-label">Type</InputLabel>
				<Select labelId="claims-type-label" autoWidth defaultValue="all">
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="medical">Medical</MenuItem>
					<MenuItem value="pharmacy">Pharmacy</MenuItem>
					<MenuItem value="dental">Dental</MenuItem>
					<MenuItem value="other">Other</MenuItem>
				</Select>
			</FormControl>
			<FormControl className={ classes.formControl }>
				<InputLabel id="claims-status-label">Status</InputLabel>
				<Select labelId="claims-status-label" autoWidth defaultValue="all">
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="paid">Paid</MenuItem>
					<MenuItem value="approved">Approved</MenuItem>
					<MenuItem value="pending">Pending</MenuItem>
					<MenuItem value="denied">Denied</MenuItem>
					<MenuItem value="deleted">Deleted</MenuItem>
				</Select>
			</FormControl>
		</Toolbar>
	);
};

const ClaimsTable: React.FC<ClaimsTableProps> = ( { claims, totalCount, currentPage } ) => {
	const router = useRouter();
	return (
		<Container maxWidth="lg">
			<Paper>
				<ClaimsTableHeader />
				<TableContainer>
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
							{ claims.map( ( { id, date, claim, provider, type, billed, cost, status }: Claim ) => (
								<TableRow key={ id }>
									<TableCell>{ date }</TableCell>
									<TableCell>
										<TextLink href={ `/claims/${ claim }` } color="inherit">{ claim }</TextLink>
									</TableCell>
									<TableCell><ProviderLink color="inherit" provider={ provider } /></TableCell>
									<TableCell>{ claimType( type || '' ) }</TableCell>
									<TableCell align="right">{ numberFormat( billed || 0, true ) }</TableCell>
									<TableCell align="right">{ numberFormat( cost || 0, true ) }</TableCell>
									<TableCell>{ claimStatus( status ) }</TableCell>
								</TableRow>
							) ) }
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPage={ 20 }
									rowsPerPageOptions={ [ 20 ] }
									count={ totalCount }
									page={ currentPage }
									onChangePage={ ( event, page ) => router.push( `/claims/page/${ page + 1 }` ) }
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</Paper>
		</Container>
	);
};

const Claims: React.FC<ClaimsProps> = ( { currentPage } ) => {
	const { loading, data } = useClaimsIndexQuery( { variables: { offset: currentPage * 20 } } );

	const headerActions = [
		{
			href: '/claims/upload',
			action: 'Upload claims',
			icon: <UploadIcon />,
		},
		{
			href: '/claims/new',
			action: 'New claim',
			icon: <AddIcon />,
			color: 'secondary',
		},
	] as ActionItem[];

	return <>
		<Container maxWidth="md">
			<Header title="Claims" actions={ headerActions } />
			{ loading && <Box my={ 4 }><LinearProgress /></Box> }
		</Container>
		{ data && <ClaimsTable
			totalCount={ data.getClaims.totalCount }
			claims={ data.getClaims.claims as Claim[] }
			currentPage={ currentPage }
		/> }
		<Container maxWidth="md"><Footer /></Container>
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
