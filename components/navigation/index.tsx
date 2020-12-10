import {
	AppBar,
	Container,
	Theme,
	Toolbar,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';

import SearchBar, { SearchOption } from 'components/search-bar';
import NavItem from './nav-item';
import navigation from 'config/navigation';

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		title: {
			flexGrow: 1,
			display: 'none',
			[ theme.breakpoints.up( 'sm' ) ]: {
				display: 'block',
			},
		},
		toolbar: {
			flexGrow: 1,
			justifyContent: 'center',
			[ theme.breakpoints.up( 'sm' ) ]: {
				justifyContent: 'right',
			},
		},
	} )
);

type NavigationProps = {
	title: string;
}

const placeholderData: SearchOption[] = [
	{
		title: 'Claim 1',
		href: '/claim/1',
	},
	{
		title: 'Call on 1/2/20',
		href: '/claim/1/2/20',
	},
];

const Navigation: React.FC<NavigationProps> = ( { title } ) => {
	const classes = useStyles();
	const { breakpoints } = useTheme();
	const isXSmall = useMediaQuery( breakpoints.only( 'xs' ) );

	return (
		<AppBar position="static">
			<Container maxWidth="md">
				<Toolbar className={ classes.toolbar }>
					{ title && (
						<Typography variant="h6" className={ classes.title }>
							{ title }
						</Typography>
					) }
					<SearchBar options={ placeholderData } minimized={ isXSmall } />
					{ navigation.map( ( navItem ) => <NavItem { ...navItem } key={ navItem.href } /> ) }
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navigation;
