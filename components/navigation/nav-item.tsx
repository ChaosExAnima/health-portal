import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

const PREFIX = 'NavItem';

const classes = {
	inactive: `${ PREFIX }-inactive`,
};

const StyledLink = styled( Link )( ( { theme } ) => ( {
	[ `& .${ classes.inactive }` ]: {
		color: theme.palette.primary.light,
		'&:hover': {
			color: 'inherit',
		},
	},
} ) );

type NavItemLinkProps = {
	name: string;
	href: string;
	icon: React.ReactNode;
	path: string;
};

const NavItem: React.FC< NavItemLinkProps > = ( {
	name,
	icon,
	href,
	path,
} ) => {
	let active = false;
	if ( href === '/' ) {
		active = path === '/';
	} else if ( path.includes( href ) ) {
		active = true;
	}
	return (
		<StyledLink href={ href }>
			<Tooltip title={ name }>
				<IconButton
					aria-label={ name }
					className={ active ? '' : classes.inactive }
					size="large"
				>
					{ icon }
				</IconButton>
			</Tooltip>
		</StyledLink>
	);
};

export default NavItem;
