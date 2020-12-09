import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Navigation from 'components/navigation';

import theme from 'theme';

export default function MyApp( props ) {
	const { Component, pageProps } = props;

	React.useEffect( () => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector( '#jss-server-side' );
		if ( jssStyles ) {
			jssStyles.parentElement.removeChild( jssStyles );
		}
	}, [] );

	const title = pageProps.title ?? 'Health Portal';

	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={ theme } >
				{ /* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */ }
				<CssBaseline />
				<Navigation title={ title } />
				<Component { ...pageProps } />
			</ThemeProvider>
		</>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
