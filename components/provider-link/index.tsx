import Link from 'components/link';
import type { Provider } from 'global-types';

const ProviderLink: React.FC<{ provider: Provider }> = ( { provider } ) => (
	<Link href={ `/providers/${ provider.id }` }>{ provider.name }</Link>
);

export default ProviderLink;
