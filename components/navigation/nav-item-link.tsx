import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
// import Link from 'components/link';
import Link from 'next/link';

import type { NavItemLinkProps } from './index.d';

export default function NavItemLink( { name, icon, href }: NavItemLinkProps ) {
	return (
		<Link href={ href }>
			<ListItem button>
				<ListItemIcon>{ icon }</ListItemIcon>
				<ListItemText primary={ name } />
			</ListItem>
		</Link>
	);
}
