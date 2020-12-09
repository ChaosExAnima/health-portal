import { createMuiTheme } from '@material-ui/core/styles';
import { purple, blue } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme( {
	palette: {
		type: 'dark',
		primary: purple,
		secondary: blue,
	},
} );

export default theme;
