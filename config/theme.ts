import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { purple, blue } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme(
	adaptV4Theme( {
		typography: {
			fontSize: 16,
		},
		palette: {
			mode: 'dark',
			primary: purple,
			secondary: blue,
		},
		props: {
			MuiButton: {
				variant: 'contained',
			},
			MuiTextField: {
				margin: 'normal',
			},
		},
	} )
);

export default theme;
