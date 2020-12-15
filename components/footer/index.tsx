import {
	Container,
	Link,
	Box,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

const Footer: React.FC = () => (
	<Container maxWidth="md">
		<Box my={ 4 } display="flex" justifyContent="space-between" alignItems="center">
			<Link href="https://github.com/ChaosExAnima/health-portal/blob/main/LICENSE" target="_blank" rel="noreferrer" color="inherit">
				&copy; 2020, MIT Licensed
			</Link>
			<Link href="https://github.com/ChaosExAnima/health-portal" target="_blank" rel="noreferrer" color="inherit">
				<GitHubIcon />
			</Link>
		</Box>
	</Container>
);

export default Footer;
