import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';

import SearchBar from 'components/search-bar';
import Link from 'components/link';
import navigation from 'config/navigation';
import NavItem from './nav-item';

import type { SearchOption } from 'components/search-bar/types';

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

export default function Navigation( {
	title,
	maxWidth = 'md',
}: NavigationProps ) {
	const { breakpoints } = useTheme();
	const isXSmall = useMediaQuery( breakpoints.only( 'xs' ) );
	const { pathname } = useRouter();

	return (
		<AppBar position="static">
			<Container maxWidth={ maxWidth }>
				<Toolbar
					sx={ {
						flexGrow: 1,
						justifyContent: { xs: 'center', sm: 'right' },
					} }
				>
					{ title && (
						<Typography
							variant="h6"
							sx={ {
								flexGrow: 1,
								display: { xs: 'none', sm: 'block' },
								textShadow: '0 0 white',
								color: 'transparent',
							} }
						>
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
		</AppBar>
	);
}
