import { IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';

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
		<Link href={ href }>
			<Tooltip title={ name }>
				<IconButton
					aria-label={ name }
					sx={ [
						active && {
							color: 'primary.light',
							'&:hover': { color: 'inherit' },
						},
					] }
					size="large"
				>
					{ icon }
				</IconButton>
			</Tooltip>
		</Link>
	);
};

export default NavItem;
