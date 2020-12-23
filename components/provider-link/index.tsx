import Link, { LinkProps } from 'components/link';
import type { Provider } from 'global-types';

const ProviderLink: React.FC<Omit<LinkProps, 'href'> & { provider: Provider }> = ( { provider, ...props } ) => (
	typeof provider === 'string'
		? <>provider</>
		: <Link { ...props } href={ `/providers/${ provider.id }` }>{ provider.name }</Link>
);

export default ProviderLink;
