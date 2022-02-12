import React from 'react';
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

import theme from 'config/theme';
import createEmotionCache from 'config/emotion-cache';

export default class HealthPortal extends Document {
	render(): JSX.Element {
		return (
			<Html lang="en">
				<Head>
					{ /* PWA primary color */ }
					<meta
						name="theme-color"
						content={ theme.palette.primary.main }
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}

	static async getInitialProps( ctx: DocumentContext ) {
		// Render app and page and get the context of the page with collected side effects.
		const originalRenderPage = ctx.renderPage;

		// You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
		// However, be aware that it can have global side effects.
		const cache = createEmotionCache();
		const { extractCriticalToChunks } = createEmotionServer( cache );

		ctx.renderPage = () =>
			originalRenderPage( {
				enhanceApp: ( App: any ) => ( props ) => (
					<App emotionCache={ cache } { ...props } />
				),
			} );

		const initialProps = await Document.getInitialProps( ctx );
		const emotionStyles = extractCriticalToChunks( initialProps.html );
		const emotionStyleTags = emotionStyles.styles.map( ( style ) => (
			<style
				data-emotion={ `${ style.key } ${ style.ids.join( ' ' ) }` }
				key={ style.key }
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={ { __html: style.css } }
			/>
		) );

		return {
			...initialProps,
			emotionStyleTags,
		};
	}
}
