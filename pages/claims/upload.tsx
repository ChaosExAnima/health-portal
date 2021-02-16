import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	createStyles,
	LinearProgress,
	makeStyles,
	Paper,
	Theme,
	Typography,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useMemo } from 'react';
import { Alert } from '@material-ui/lab';

import Link from 'components/link';
import ButtonLink from 'components/button-link';
import { useUploadClaimsMutation } from 'lib/apollo/queries/claims.graphql';

import type { PageProps } from 'global-types';

type ClaimUploadPageProps = PageProps;

const useStyles = makeStyles( ( { palette, shape, spacing }: Theme ) =>
	createStyles( {
		'@keyframes progress': {
			'0%': {
				backgroundPosition: '0 0',
			},
			'100%': {
				backgroundPosition: '-70px 0',
			},
		},
		uploadError: {
			marginBottom: spacing( 4 ),
		},
		dropzone: {
			borderColor: palette.divider,
			borderRadius: shape.borderRadius,
			borderStyle: 'dashed',
			borderWidth: 4,
			padding: spacing( 6 ),
			cursor: 'pointer',
		},
		dropzoneAccept: {
			animation: '$progress 2s linear infinite !important',
			backgroundImage: `repeating-linear-gradient(
			-45deg,
			${ palette.background.paper },
			${ palette.background.paper } 25px,
			${ palette.divider } 25px,
			${ palette.divider } 50px
		)`,
			backgroundSize: '150% 100%',
			border: 'solid',
			borderColor: palette.success.dark,
			color: palette.success.light,
		},
		dropzoneReject: {
			color: palette.error.main,
		},
		uploadSuccess: {
			borderColor: palette.divider,
			borderRadius: shape.borderRadius,
			borderWidth: 4,
			padding: spacing( 6 ),
		},
		resetButton: {
			marginLeft: spacing( 1 ),
		},
	} )
);

const ClaimUploadPage: React.FC< ClaimUploadPageProps > = () => {
	const [
		uploadClaims,
		{ data, loading, error },
	] = useUploadClaimsMutation();
	const {
		getRootProps,
		getInputProps,
		isDragAccept,
		isDragReject,
	} = useDropzone( {
		accept: 'text/csv',
		onDropAccepted: ( files ) =>
			uploadClaims( { variables: { file: files[ 0 ] } } ),
	} );
	const classes = useStyles();

	const dropzoneClasses = useMemo(
		() =>
			[
				classes.dropzone,
				isDragAccept && classes.dropzoneAccept,
				isDragReject && classes.dropzoneReject,
			]
				.filter( Boolean )
				.join( ' ' ),
		[ isDragReject, isDragAccept ]
	);

	const hasUploadError = error || ( data && ! data.uploadClaims.success );

	return (
		<Container maxWidth="md">
			<Box my={ 2 }>
				<Breadcrumbs>
					<Link color="inherit" href="/claims">
						Claims
					</Link>
					<Typography>Upload claims</Typography>
				</Breadcrumbs>
			</Box>
			<Box my={ 4 }>
				<Typography variant="h4" component="h1">
					Upload Claims
				</Typography>
			</Box>
			{ hasUploadError && (
				<Alert severity="error" className={ classes.uploadError }>
					There was an error processing your uploads.
				</Alert>
			) }
			{ ! loading && ( ! data || hasUploadError ) && (
				<Paper
					{ ...getRootProps() }
					className={ dropzoneClasses }
					elevation={ isDragAccept ? 3 : 0 }
				>
					<input { ...getInputProps() } />
					<Typography variant="h6" component="p" align="center">
						{ ! isDragReject && 'Drop claims here' }
						{ isDragReject && 'CSV files only' }
					</Typography>
				</Paper>
			) }
			{ loading && <LinearProgress /> }
			{ data?.uploadClaims.success && (
				<>
					<Paper className={ classes.uploadSuccess }>
						<Typography variant="h6" component="p" align="center">
							{ data.uploadClaims.claimsProcessed } claims
							processed!
						</Typography>
					</Paper>
					<Box my={ 4 }>
						<ButtonLink href="/claims" color="primary">
							Go back to claims
						</ButtonLink>
						<Button
							color="secondary"
							className={ classes.resetButton }
						>
							Upload another file
						</Button>
					</Box>
				</>
			) }
		</Container>
	);
};

export async function getStaticProps(): Promise< {
	props: ClaimUploadPageProps;
} > {
	return {
		props: {
			title: 'Upload Claims',
		},
	};
}

export default ClaimUploadPage;
