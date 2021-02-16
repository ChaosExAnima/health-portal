import Link, { LinkProps } from 'components/link';

import type { Provider } from 'lib/apollo/schema/index.graphqls';

type ProviderLinkProps = Omit< LinkProps, 'href' > & {
	provider: Pick< Provider, 'slug' | 'name' >;
};

const ProviderLink: React.FC< ProviderLinkProps > = ( {
	provider,
	...props
} ) => (
	<Link { ...props } href={ `/providers/${ provider.slug }` }>
		{ provider.name }
	</Link>
);

export default ProviderLink;
