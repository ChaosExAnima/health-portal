import {
	createStyles,
	IconButton,
	makeStyles,
	Theme,
	Tooltip,
} from '@material-ui/core';
import Link from 'next/link';

type NavItemLinkProps = {
	name: string;
	href: string;
	icon: React.ReactNode;
	path: string;
}

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	inactive: {
		color: theme.palette.primary.light,
		'&:hover': {
			color: 'inherit',
		},
	},
} ) );

const NavItem: React.FC<NavItemLinkProps> = ( { name, icon, href, path } ) => {
	const classes = useStyles();
	let active = false;
	if ( href === '/' ) {
		active = path === '/';
	} else if ( path.includes( href ) ) {
		active = true;
	}
	return (
		<Link href={ href }>
			<Tooltip title={ name }>
				<IconButton aria-label={ name } className={ active ? '' : classes.inactive }>
					{ icon }
				</IconButton>
			</Tooltip>
		</Link>
	);
};

export default NavItem;

