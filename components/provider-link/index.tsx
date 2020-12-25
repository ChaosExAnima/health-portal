import Link, { LinkProps } from 'components/link';
import { Provider } from 'lib/apollo/schema/index.graphqls';

const ProviderLink: React.FC<Omit<LinkProps, 'href'> & { provider: Provider }> = ( { provider, ...props } ) => (
	<Link { ...props } href={ `/providers/${ provider.id }` }>{ provider.name }</Link>
);

export default ProviderLink;
