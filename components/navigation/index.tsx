import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import SearchBar, { SearchOption } from 'components/search-bar';
import Link from 'components/link';
import NavItem from './nav-item';
import navigation from 'config/navigation';
import { useRouter } from 'next/router';

const PREFIX = 'Navigation';

const classes = {
	title: `${ PREFIX }-title`,
	toolbar: `${ PREFIX }-toolbar`,
};

const StyledAppBar = styled( AppBar )( ( { theme } ) => ( {
	[ `& .${ classes.title }` ]: {
		flexGrow: 1,
		display: 'none',
		color: 'transparent',
		textShadow: '0 0 white',
		[ theme.breakpoints.up( 'sm' ) ]: {
			display: 'block',
		},
	},

	[ `& .${ classes.toolbar }` ]: {
		flexGrow: 1,
		justifyContent: 'center',
		[ theme.breakpoints.up( 'sm' ) ]: {
			justifyContent: 'right',
		},
	},
} ) );

type NavigationProps = {
	title: string;
	maxWidth?: 'md' | 'lg';
};

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

const Navigation: React.FC< NavigationProps > = ( {
	title,
	maxWidth = 'md',
} ) => {
	const { breakpoints } = useTheme();
	const isXSmall = useMediaQuery( breakpoints.only( 'xs' ) );
	const { pathname } = useRouter();

	return (
		<StyledAppBar position="static">
			<Container maxWidth={ maxWidth }>
				<Toolbar className={ classes.toolbar }>
					{ title && (
						<Typography variant="h6" className={ classes.title }>
							<Link href="/" color="inherit" underline="none">
								{ title }
							</Link>
						</Typography>
					) }
					<SearchBar
						options={ placeholderData }
						minimized={ isXSmall }
					/>
					{ navigation.map( ( navItem ) => (
						<NavItem
							{ ...navItem }
							key={ navItem.href }
							path={ pathname }
						/>
					) ) }
				</Toolbar>
			</Container>
		</StyledAppBar>
	);
};

export default Navigation;
