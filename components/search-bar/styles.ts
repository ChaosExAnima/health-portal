import { SxProps, alpha, Theme } from '@mui/material';

const sx: Record< string, SxProps< Theme > > = {
	root: {
		position: 'relative',
		borderRadius: 1,
		marginLeft: {
			xs: 0,
			sm: 1,
		},
		width: {
			xs: '100%',
			sm: 'auto',
		},
		backgroundColor: ( theme: Theme ) => ( {
			sm: alpha( theme.palette.common.white, 0.15 ),
		} ),
		'&:hover': ( theme: Theme ) => ( {
			backgroundColor: {
				sm: alpha( theme.palette.common.white, 0.25 ),
			},
		} ),
		'& svg': {
			color: 'primary.light',
		},
		'&:hover svg': {
			color: 'inherit',
		},
	},

	searchIcon: ( theme: Theme ) => ( {
		padding: theme.spacing( 0, 2 ),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	} ),

	input: ( theme: Theme ) => ( {
		transition: theme.transitions.create( 'width' ),
		width: {
			xs: '100%',
			sm: '12ch',
		},
		'&.Mui-focused': {
			width: {
				sm: '20ch',
			},
		},
	} ),
} as const;

export default sx;
