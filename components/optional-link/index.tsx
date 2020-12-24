import Link, { LinkProps } from 'components/link';
import type { Optional } from 'global-types';

const OptionalLink: React.FC<Optional<LinkProps, 'href'>> = ( { children, href, ...props } ) => {
	return href
		? <Link href={ href } {...props}>{ children }</Link>
		: <>{ children }</>;
};

export default OptionalLink;
