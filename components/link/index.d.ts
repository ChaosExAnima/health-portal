import { LinkProps as NextLinkProps } from 'next/link';
// import MuiLinkProps from '@material-ui/core/link';

export type LinkProps = NextLinkProps & {
	href: string | URL;
	className?: string;
};

export type RefLinkProps = React.HTMLAttributes & {
	onClick?: Function;
	className: string;
};
