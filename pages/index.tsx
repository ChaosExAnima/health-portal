import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/Phone';
import Paper from '@material-ui/core/Paper';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Link from 'next/link';

import InfoRow from 'components/info-row';
import numberFormat from 'lib/number-format';

type HomeProps = {
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

export default function Home( { welcomeMessage, totalSpent, totalCovered, totalClaims }: HomeProps ) {
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
		</Container>
	);
}

export async function getServerSideProps(): Promise<{ props: HomeProps }> {
	const welcomeMessages = [
		'Welcome to the health portal! 👋🏻',
		'What are you dealing with today? 😐',
		'Hope things are okay? 💖',
	];
	return {
		props: {
			welcomeMessage: welcomeMessages[ Math.floor( Math.random() * welcomeMessages.length ) ],
			totalSpent: 2555,
			totalCovered: 54312,
			totalClaims: 39,
		},
	};
}
