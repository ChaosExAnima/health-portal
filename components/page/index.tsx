import { Box, Container, Theme } from '@mui/material';
import Breadcrumbs from 'components/breadcrumbs';
import Footer from 'components/footer';
import Header from 'components/header';
import { PageProps } from './types';

export default function Page( {
	maxWidth = 'md',
	breadcrumbs,
	header,
	title,
	children,
}: PageProps ) {
	return (
		<Container
			maxWidth={ maxWidth }
			sx={ {
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
			} }
			component="main"
		>
			{ breadcrumbs && <Breadcrumbs breadcrumbs={ breadcrumbs } /> }
			<Header { ...header } title={ title } />
			<Box flexGrow="1">{ children }</Box>
			<Footer />
		</Container>
	);
}
