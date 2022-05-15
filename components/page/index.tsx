import { Box, Container } from '@mui/material';

import Breadcrumbs from 'components/breadcrumbs';
import Footer from 'components/footer';
import Header from 'components/header';

import { PageProps } from './types';

export default function Page( {
	maxWidth = 'md',
	breadcrumbs,
	title,
	children,
	...headerProps
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
			<Header { ...headerProps } title={ title } />
			<Box flexGrow="1">{ children }</Box>
			<Footer />
		</Container>
	);
}
