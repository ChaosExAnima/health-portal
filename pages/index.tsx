import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Paper } from '@material-ui/core';

export default function Home() {
	return (
		<Container maxWidth="lg">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1" gutterBottom>
					Welcome!
				</Typography>
			</Box>
			<Paper>Paper?</Paper>
		</Container>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: 'Home',
		},
	};
}
