import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

type NavItemLinkProps = {
	name: string;
	href: string;
	icon: React.ReactNode;
}

const NavItem: React.FC<NavItemLinkProps> = ( { name, icon, href } ) => {
	const { pathname } = useRouter();
	let active = false;
	if ( href === '/' ) {
		active = pathname === '/';
	} else if ( pathname.includes( href ) ) {
		active = true;
	}
	return (
		<Link href={ href }>
			<IconButton aria-label={ name } disabled={ active }>
				{ icon }
			</IconButton>
		</Link>
	);
};

export default NavItem;

