import {
	Box,
	Breadcrumbs as BreadcrumbsUI,
	Typography,
} from '@material-ui/core';

import Link from 'components/link';

type Breadcrumb = string | {
	name: string;
	href: string;
};

type BreadcrumbsProps = {
	breadcrumbs: Breadcrumb[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ( { breadcrumbs } ) => (
	<Box my={ 2 }>
		<BreadcrumbsUI aria-label="breadcrumb">
			{ breadcrumbs.map( ( breadcrumb: Breadcrumb ) => (
				typeof breadcrumb !== 'string'
					? <Link color="inherit" href={ breadcrumb.href } key={ breadcrumb.href }>{ breadcrumb.name }</Link>
					: <Typography color="textPrimary" aria-current="page" key={ breadcrumb }>{ breadcrumb }</Typography>
			) ) }
		</BreadcrumbsUI>
	</Box>
);

export default Breadcrumbs;
