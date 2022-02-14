import { Container } from '@mui/material';
import { DocumentContext } from 'next/document';

import CustomDocument from 'pages/_document';

describe( 'Document', () => {
	const MockApp = () => <Container sx={ { margin: 1 } } />;
	describe( 'getInitialProps', () => {
		it( 'adds emotion style tags', async () => {
			const ctx: DocumentContext = {
				pathname: '/',
				query: {},
				AppTree: MockApp,
				defaultGetInitialProps: () => Promise.resolve( { html: '' } ),
				renderPage: () => Promise.resolve( { html: '' } ),
			};
			const props = await CustomDocument.getInitialProps( ctx );
			expect( props?.emotionStyleTags ).toHaveLength( 1 );
		} );
	} );
} );
