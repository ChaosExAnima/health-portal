import { PropsWithChildren, ReactChild } from 'react';
import { BreadcrumbsProps, ContainerProps } from '@mui/material';

import { HeaderProps } from 'components/header';
import { Breadcrumb } from 'components/breadcrumbs';

interface PageProps extends HeaderProps {
	maxWidth?: ContainerProps[ 'maxWidth' ];
	children: ReactChild | ReactChild[];
	breadcrumbs?: Breadcrumb[];
}
