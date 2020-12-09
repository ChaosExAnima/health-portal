import { ListItem } from '@material-ui/core';
import Link from 'components/link';

import type { NavItemLinkProps } from './index.d';

export default function NavItemLink( { href, children }: NavItemLinkProps ) {
	const ListLink = <Link href={ href } />;
	return (
		<ListItem component={ ListLink }>
			{ children }
		</ListItem>
	);
}
