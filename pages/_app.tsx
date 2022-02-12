import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import {
	ThemeProvider,
	Theme,
	StyledEngineProvider,
} from '@mui/material/styles';
import { useEffect } from 'react';

import Navigation from 'components/navigation';
import theme from 'config/theme';

import type { AppProps } from 'next/app';

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

const App: React.FC< AppProps > = ( { Component, pageProps } ) => {
	useEffect( () => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector( '#jss-server-side' );
		if ( jssStyles && jssStyles.parentElement ) {
			jssStyles.parentElement.removeChild( jssStyles );
		}
	}, [] );

	const title = pageProps.title
		? `${ pageProps.title } - Health Portal`
		: 'Health Portal';

	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={ theme }>
					<CssBaseline />
					<Navigation title="Health Portal ⚕️" />
					<Component { ...pageProps } />
				</ThemeProvider>
			</StyledEngineProvider>
		</>
	);
};

export default App;
