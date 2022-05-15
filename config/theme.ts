import { purple, blue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme( {
	typography: {
		fontSize: 16,
	},
	palette: {
		mode: 'dark',
		primary: purple,
		secondary: blue,
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: 'contained',
			},
		},
		MuiTextField: {
			defaultProps: {
				margin: 'normal',
				fullWidth: true,
			},
		},
	},
} );

export default theme;
