import Link, { LinkProps } from 'components/link';

type OptionalLinkProps = Omit< LinkProps, 'href' > & { href?: string | null };

const OptionalLink: React.FC< OptionalLinkProps > = ( {
	children,
	href,
	...props
} ) => {
	return href ? (
		<Link href={ href } { ...props }>
			{ children }
		</Link>
	) : (
		<>{ children }</>
	);
};

export default OptionalLink;
