import { createMuiTheme } from '@material-ui/core/styles';
import { purple, blue } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme( {
	typography: {
		fontSize: 16,
	},
	palette: {
		type: 'dark',
		primary: purple,
		secondary: blue,
	},
	props: {
		MuiButton: {
			variant: 'contained',
		},
	},
} );

export default theme;
