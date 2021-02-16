import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';

export type LinkProps = MuiLinkProps & NextLinkProps;

const Link: React.FC< LinkProps > = ( props ) => (
	<NextLink href={ props.href }>
		<MuiLink { ...props }>{ props.children }</MuiLink>
	</NextLink>
);

export default Link;
