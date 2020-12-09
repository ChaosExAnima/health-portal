import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import clsx from 'clsx';

import type { RefLinkProps, LinkProps } from './index.d';

const RefLink = React.forwardRef( ( { onClick, className }: RefLinkProps ) => (
	<MuiLink onClick={ onClick } className={ className } />
) );

function Link( props: LinkProps ) {
	const {
		href,
		className: classNameProps,
		...other
	} = props;

	const router = useRouter();
	const pathname = typeof href === 'string' ? href : href.pathname;
	const className = clsx( classNameProps, {
		active: router.pathname === pathname,
	} );

	return (
		<NextLink href={ href } passHref>
			<RefLink className={ className } { ...other } />
		</NextLink>
	);
}

export default Link;
