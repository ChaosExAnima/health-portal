import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';

export type LinkProps = MuiLinkProps & NextLinkProps;

const Link: React.FC< LinkProps > = ( props ) => (
	<NextLink href={ props.href }>
		<MuiLink { ...props }>{ props.children }</MuiLink>
	</NextLink>
);

export default Link;
