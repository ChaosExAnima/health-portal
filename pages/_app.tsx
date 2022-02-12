import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';

import Navigation from 'components/navigation';
import createEmotionCache from 'config/emotion-cache';
import theme from 'config/theme';

import type { AppProps } from 'next/app';

const clientSideEmotionCache = createEmotionCache();

const App: React.FC< AppProps & { emotionCache?: EmotionCache } > = (
	props
) => {
	const {
		Component,
		pageProps,
		emotionCache = clientSideEmotionCache,
	} = props;

	const title = pageProps.title
		? `${ pageProps.title } - Health Portal`
		: 'Health Portal';

	return (
		<CacheProvider value={ emotionCache }>
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
		</CacheProvider>
	);
};

export default App;
