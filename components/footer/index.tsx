import {
	Box,
	Container,
	Link,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

const FooterBase: React.FC = () => (
	<Box my={ 4 } display="flex" justifyContent="space-between" alignItems="center">
		<Link href="https://github.com/ChaosExAnima/health-portal/blob/main/LICENSE" target="_blank" rel="noreferrer" color="inherit">
			&copy; 2020, MIT Licensed
		</Link>
		<Link href="https://github.com/ChaosExAnima/health-portal" target="_blank" rel="noreferrer" color="inherit">
			<GitHubIcon />
		</Link>
	</Box>
);

const Footer: React.FC<{ wrap?: boolean; }> = ( { wrap = false } ) => (
	wrap
		? <Container maxWidth="md"><FooterBase /></Container>
		: <FooterBase />
);

export default Footer;
