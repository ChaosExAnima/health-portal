import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const loading = () => (
	<CircularProgress sx={ { margin: 'auto 3rem', width: '100%' } } />
);

export const AppealForm = dynamic( () => import( './appeal' ), { loading } );

export const CallForm = dynamic( () => import( './call' ), { loading } );

export const ClaimForm = dynamic( () => import( './claim' ), { loading } );

export const ProviderForm = dynamic( () => import( './provider' ), {
	loading,
} );
