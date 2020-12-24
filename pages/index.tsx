import {
	Box,
	Button,
	Container,
	Grid,
	Paper,
	Theme,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Link from 'next/link';
import PhoneIcon from '@material-ui/icons/Phone';

import InfoRow from 'components/info-row';
import Footer from 'components/footer';
import numberFormat from 'lib/number-format';

import type { PageProps } from 'global-types';

type HomeProps = PageProps & {
	welcomeMessage: string;
	totalSpent: number;
	totalCovered: number;
	totalClaims: number;
};

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	info: {
		padding: theme.spacing( 3 ),
	},
} ) );

const Home: React.FC<HomeProps> = ( { welcomeMessage, totalSpent, totalCovered, totalClaims } ) => {
	const classes = useStyles();
	const buttonProps = {
		size: 'large',
		mx: 3,
	} as const;

	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				<Typography variant="h3" component="h1">
					{ welcomeMessage }
				</Typography>
			</Box>
			<Box my={ 4 }>
				<Grid container spacing={ 4 }>
					<Grid item>
						<Link href="/calls/new">
							<Button color="primary" startIcon={ <PhoneIcon /> } { ...buttonProps }>
								New Call
							</Button>
						</Link>
					</Grid>
					<Grid item>
						<Link href="/claims/upload">
							<Button color="secondary" startIcon={ <CloudUploadIcon /> } { ...buttonProps }>
								Upload claims
							</Button>
						</Link>
					</Grid>
				</Grid>
			</Box>
			<Paper elevation={ 2 } className={ classes.info }>
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
