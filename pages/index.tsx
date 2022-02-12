import { Box, Container, Grid, Paper, Theme, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import UploadIcon from '@mui/icons-material/CloudUpload';
import CallIcon from '@mui/icons-material/Phone';
import { toInteger } from 'lodash';

import ButtonLink from 'components/button-link';
import Footer from 'components/footer';
import InfoRow from 'components/info-row';
import { extractCount, extractSum } from 'lib/db/utils';
import { queryAllMeta, queryClaims } from 'lib/db/helpers';
import { formatCurrency } from 'lib/strings';

import type { PageProps } from 'global-types';
import type { Claim } from 'lib/entities/types';

type HomeProps = PageProps & {
	welcomeMessage: string;
	totalSpent: number;
	totalCovered: number;
	totalClaims: number;
};

const useStyles = makeStyles( ( { spacing }: Theme ) =>
	createStyles( {
		actionButtons: {
			marginTop: spacing( 1 ),
		},
		info: {
			padding: spacing( 3 ),
		},
	} )
);

const Home: React.FC< HomeProps > = ( {
	welcomeMessage,
	totalSpent,
	totalCovered,
	totalClaims,
} ) => {
	const classes = useStyles();

	return (
		<Container maxWidth="md" component="main">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					{ welcomeMessage }
				</Typography>
				<Grid
					container
					spacing={ 4 }
					className={ classes.actionButtons }
				>
					<Grid item>
						<ButtonLink
							href="/calls/new"
							color="primary"
							startIcon={ <CallIcon /> }
							size="large"
						>
							New call
						</ButtonLink>
					</Grid>
					<Grid item>
						<ButtonLink
							href="/claims/upload"
							color="secondary"
							startIcon={ <UploadIcon /> }
							size="large"
						>
							Upload claims
						</ButtonLink>
					</Grid>
				</Grid>
			</Box>
			{ /* TODO: Unify design for info boxes. */ }
			<Paper
				elevation={ 2 }
				className={ classes.info }
				component="section"
			>
				<Grid container spacing={ 4 } direction="column">
					<InfoRow
						info="You&lsquo;ve spent"
						value={ formatCurrency( totalSpent ) }
					/>
					<InfoRow
						info="Your insurance paid"
						value={ formatCurrency( totalCovered ) }
					/>
					<InfoRow
						href="/claims"
						info="Over these claims"
						value={ toInteger( totalClaims ) }
					/>
				</Grid>
			</Paper>
			<Footer />
		</Container>
	);
};

export async function getServerSideProps(): Promise< { props: HomeProps } > {
	const welcomeMessages = [
		'Welcome to the health portal! 👋🏻',
		'What are you dealing with today? 😐',
		'Hope things are okay? 💖',
	];

	const [ count, billed, cost ] = await Promise.all( [
		extractCount( 'id', queryClaims() ),
		extractSum( 'value', queryAllMeta< Claim >( 'billed' ) ),
		extractSum( 'value', queryAllMeta< Claim >( 'cost' ) ),
	] );

	return {
		props: {
			title: 'Home',
			welcomeMessage:
				welcomeMessages[
					Math.floor( Math.random() * welcomeMessages.length )
				],
			totalSpent: cost || 0,
			totalCovered: billed || 0,
			totalClaims: count || 0,
		},
	};
}

export default Home;
