import { TypographyProps } from '@material-ui/core';

export type NavigationProps = {
	title: string;
}

export type NavItemLinkProps = TypographyProps<'a', { component: 'a' }> & {
	href: string;
	children?: React.ReactNode;
}
