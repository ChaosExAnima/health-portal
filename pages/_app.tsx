import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';

import Navigation from 'components/navigation';
import theme from 'config/theme';
import { createApolloClient } from 'lib/apollo';

import type { AppProps } from 'next/app';

const App: React.FC<AppProps> = async ( { Component, pageProps } ) => {
	useEffect( () => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector( '#jss-server-side' );
		if ( jssStyles && jssStyles.parentElement ) {
			jssStyles.parentElement.removeChild( jssStyles );
		}
	}, [] );

	const title = pageProps.title ? `${ pageProps.title } - Health Portal` : 'Health Portal';

	const client = await createApolloClient();

	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={ theme } >
				<ApolloProvider client={ client }>
					{ /* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
					<CssBaseline />
					<Navigation title="Health Portal ⚕️" />
					<Component { ...pageProps } />
				</ApolloProvider>
			</ThemeProvider>
		</>
	);
};

export default App;
