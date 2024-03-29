import { Box, Breadcrumbs as BreadcrumbsUI, Typography } from '@mui/material';

import Link from 'components/link';

export type Breadcrumb =
	| string
	| {
			name: string;
			href: string;
	  };

export type BreadcrumbsProps = {
	breadcrumbs: Breadcrumb[];
};

const Breadcrumbs: React.FC< BreadcrumbsProps > = ( { breadcrumbs } ) => (
	<Box my={ 2 }>
		<BreadcrumbsUI aria-label="breadcrumb">
			{ breadcrumbs.map( ( breadcrumb: Breadcrumb ) =>
				typeof breadcrumb !== 'string' ? (
					<Link
						color="inherit"
						href={ breadcrumb.href }
						key={ breadcrumb.href }
					>
						{ breadcrumb.name }
					</Link>
				) : (
					<Typography
						color="textPrimary"
						aria-current="page"
						key={ breadcrumb }
					>
						{ breadcrumb }
					</Typography>
				)
			) }
		</BreadcrumbsUI>
	</Box>
);

export default Breadcrumbs;
