import { IconButton, Theme, Tooltip } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Link from 'next/link';

type NavItemLinkProps = {
	name: string;
	href: string;
	icon: React.ReactNode;
	path: string;
};

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		inactive: {
			color: theme.palette.primary.light,
			'&:hover': {
				color: 'inherit',
			},
		},
	} )
);

const NavItem: React.FC< NavItemLinkProps > = ( {
	name,
	icon,
	href,
	path,
} ) => {
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
				<IconButton
					aria-label={ name }
					className={ active ? '' : classes.inactive }
					size="large"
				>
					{ icon }
				</IconButton>
			</Tooltip>
		</Link>
	);
};

export default NavItem;
