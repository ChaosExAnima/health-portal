import {
	Alert,
	Box,
	Button,
	Container,
	Paper,
	Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

import Breadcrumbs from 'components/breadcrumbs';
import ButtonLink from 'components/button-link';
import Footer from 'components/footer';
import Header from 'components/header';

import type { GetPageResult, PageProps } from 'pages/types';

const styles = {
	dropzone: {
		borderColor: 'divider',
		borderRadius: 1,
		borderStyle: 'dashed',
		borderWidth: 4,
		padding: 6,
		cursor: 'pointer',
	},
	dropzoneAccept: {
		borderColor: 'success.dark',
		color: 'success.light',
	},
	dropzoneReject: {
		borderColor: 'error.dark',
	},
	uploadSuccess: {
		borderColor: 'divider',
		borderRadius: 1,
		borderWidth: 4,
		padding: 6,
	},
};

export default function ClaimUploadPage( { title }: PageProps ) {
	const {
		getRootProps,
		getInputProps,
		isDragAccept,
		isDragReject,
	} = useDropzone( {
		accept: 'text/csv',
		// eslint-disable-next-line no-console
		onDropAccepted: ( files ) => console.log( files ),
	} );

	const hasUploadError = false;

	return (
		<Container maxWidth="md">
			<Breadcrumbs
				breadcrumbs={ [ { href: '/claims', name: 'Claims' }, title ] }
			/>
			<Header title="Upload Claims" />
			{ hasUploadError && (
				<Alert severity="error" sx={ { marginBottom: 4 } }>
					There was an error processing your uploads.
				</Alert>
			) }
			<Paper
				{ ...getRootProps() }
				sx={ [
					styles.dropzone,
					isDragAccept && styles.dropzoneAccept,
					isDragReject && styles.dropzoneReject,
				] }
				elevation={ isDragAccept ? 3 : 0 }
			>
				<input { ...getInputProps() } />
				<Typography variant="h6" component="p" align="center">
					{ ! isDragReject && 'Drop claims here' }
					{ isDragReject && 'CSV files only' }
				</Typography>
			</Paper>
			{ false && (
				<>
					<Paper sx={ styles.uploadSuccess }>
						<Typography variant="h6" component="p" align="center">
							-1 claims processed!
						</Typography>
					</Paper>
					<Box my={ 4 }>
						<ButtonLink href="/claims" color="primary">
							Go back to claims
						</ButtonLink>
						<Button color="secondary" sx={ { marginLeft: 1 } }>
							Upload another file
						</Button>
					</Box>
				</>
			) }
			<Footer />
		</Container>
	);
}

export function getStaticProps(): GetPageResult {
	return {
		props: {
			title: 'Upload Claims',
		},
	};
}
