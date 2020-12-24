import {
	Box,
	Container,
	Grid,
	Paper,
	Theme,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CallIcon from '@material-ui/icons/Phone';

import InfoRow from 'components/info-row';
import Footer from 'components/footer';
import numberFormat from 'lib/number-format';

import type { PageProps } from 'global-types';
import ButtonLink from 'components/button-link';

type HomeProps = PageProps & {
	welcomeMessage: string;
	totalSpent: number;
	totalCovered: number;
	totalClaims: number;
};

const useStyles = makeStyles( ( { spacing }: Theme ) => createStyles( {
	actionButtons: {
		marginTop: spacing( 1 ),
	},
	info: {
		padding: spacing( 3 ),
	},
} ) );

const Home: React.FC<HomeProps> = ( { welcomeMessage, totalSpent, totalCovered, totalClaims } ) => {
	const classes = useStyles();

	return (
		<Container maxWidth="md" component="main">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					{ welcomeMessage }
				</Typography>
				<Grid container spacing={ 4 } className={ classes.actionButtons }>
					<Grid item>
						<ButtonLink href="/calls/new" color="primary" startIcon={ <CallIcon /> } size="large">
							New call
						</ButtonLink>
					</Grid>
					<Grid item>
						<ButtonLink href="/claims/upload" color="secondary" startIcon={ <UploadIcon /> } size="large">
							Upload claims
						</ButtonLink>
					</Grid>
				</Grid>
			</Box>
			{/* TODO: Unify design for info boxes. */}
			<Paper elevation={ 2 } className={ classes.info } component="section">
				<Grid container spacing={ 4 } direction="column">
					<InfoRow info="You&lsquo;ve spent" value={ numberFormat( totalSpent, true ) } />
					<InfoRow info="Your insurance paid" value={ numberFormat( totalCovered, true ) } />
					<InfoRow href="/claims" info="Over these claims" value={ numberFormat( totalClaims ) } />
				</Grid>
			</Paper>
			<Footer />
		</Container>
	);
};

export async function getServerSideProps(): Promise<{ props: HomeProps }> {
	// TODO: Move this to GraphQL.
	const welcomeMessages = [
		'Welcome to the health portal! 👋🏻',
		'What are you dealing with today? 😐',
		'Hope things are okay? 💖',
	];
	return {
		props: {
			title: 'Home',
			welcomeMessage: welcomeMessages[ Math.floor( Math.random() * welcomeMessages.length ) ],
			totalSpent: 2555,
			totalCovered: 54312,
			totalClaims: 39,
		},
	};
}

export default Home;
