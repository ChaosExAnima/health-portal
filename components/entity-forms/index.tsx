import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

export const ProviderForm = dynamic( () => import( './provider' ), {
	loading: () => <CircularProgress />,
} );

export const ClaimForm = dynamic( () => import( './claim' ), {
	loading: () => <CircularProgress />,
} );
