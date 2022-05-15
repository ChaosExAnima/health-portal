import { CacheProvider, EmotionCache } from '@emotion/react';
import {
	Box,
	CssBaseline,
	ThemeProvider,
	StyledEngineProvider,
} from '@mui/material';
import Head from 'next/head';

import Navigation from 'components/navigation';
import createEmotionCache from 'config/emotion-cache';
import theme from 'config/theme';

import type { AppProps } from 'next/app';

const clientSideEmotionCache = createEmotionCache();

function App( props: AppProps & { emotionCache?: EmotionCache } ) {
	const {
		Component: PageComponent,
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
					<Box
						sx={ {
							display: 'flex',
							flexDirection: 'column',
							minHeight: '100vh',
						} }
					>
						<Navigation title="Health Portal ⚕️" />
						<PageComponent { ...pageProps } />
					</Box>
				</ThemeProvider>
			</StyledEngineProvider>
		</CacheProvider>
	);
}

export default App;
