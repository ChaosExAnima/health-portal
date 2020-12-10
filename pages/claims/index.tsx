import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export default function Claims() {
	return (
		<Container maxWidth="lg">
			<Box my={ 4 }>
				<Typography variant="h4" component="h1" gutterBottom>
					Claims!
				</Typography>
			</Box>
			<Paper>Paper?</Paper>
		</Container>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: 'Claims',
		},
	};
}
