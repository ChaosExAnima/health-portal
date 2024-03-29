import { Button, ButtonProps } from '@mui/material';
import Link, { LinkProps } from 'next/link';

type ButtonLinkProps = LinkProps & Omit< ButtonProps, 'href' >;

const ButtonLink: React.FC< ButtonLinkProps > = ( {
	href,
	children,
	...props
} ) => (
	<Link href={ href } passHref>
		<Button { ...props }>{ children }</Button>
	</Link>
);

export default ButtonLink;
