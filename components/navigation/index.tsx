import { AppBar, Container, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import SearchBar, { SearchOption } from 'components/search-bar';
import navigation from 'config/navigation';
import NavItem from './nav-item';

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

export default function Navigation( { title }: NavigationProps ) {
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
}
