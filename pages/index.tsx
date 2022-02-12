import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'Home';

const classes = {
	actionButtons: `${ PREFIX }-actionButtons`,
	info: `${ PREFIX }-info`,
};

const StyledPage = styled( Container )( ( { theme: { spacing } } ) => ( {
	[ `& .${ classes.actionButtons }` ]: {
		marginTop: spacing( 1 ),
	},

	[ `& .${ classes.info }` ]: {
		padding: spacing( 3 ),
	},
} ) );

type HomeProps = PageProps & {
	welcomeMessage: string;
	totalSpent: number;
	totalCovered: number;
	totalClaims: number;
};

const Home: React.FC< HomeProps > = ( {
	welcomeMessage,
	totalSpent,
	totalCovered,
	totalClaims,
} ) => {
	return (
		<Container maxWidth="md" component="main">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					{ welcomeMessage }
				</Typography>
				<Grid container spacing={ 4 } sx={ { marginTop: 1 } }>
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
			<Paper elevation={ 2 } component="section" sx={ { padding: 3 } }>
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
