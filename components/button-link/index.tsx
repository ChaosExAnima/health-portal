import { Button, ButtonProps } from '@material-ui/core';
import Link, { LinkProps } from 'next/link';

type ButtonLinkProps = LinkProps & Omit< ButtonProps, 'href' >;

const ButtonLink: React.FC< ButtonLinkProps > = ( {
	href,
	children,
	...props
} ) => (
	<Link href={ href }>
		<Button { ...props }>{ children }</Button>
	</Link>
);

export default ButtonLink;
