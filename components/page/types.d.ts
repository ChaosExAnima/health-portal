import { BreadcrumbsProps, ContainerProps } from '@mui/material';
import { PropsWithChildren, ReactChild } from 'react';

import { Breadcrumb } from 'components/breadcrumbs';
import { HeaderProps } from 'components/header';

interface PageProps extends HeaderProps {
	maxWidth?: ContainerProps[ 'maxWidth' ];
	children: ReactChild | ReactChild[];
	breadcrumbs?: Breadcrumb[];
}
