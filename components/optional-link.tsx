import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';

import type { NextURL } from 'global-types';

const OptionalLink: React.FC<{ href?: NextURL }> = ( { children, href } ) => {
	return href
		? <NextLink href={ href }>
			<MuiLink underline="none" color="inherit">
				{ children }
			</MuiLink>
		</NextLink>
		: <>{ children }</>;
};

export default OptionalLink;
