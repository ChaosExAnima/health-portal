import { PropsWithChildren, ReactChild } from 'react';
import { BreadcrumbsProps, ContainerProps } from '@mui/material';

import { HeaderProps } from 'components/header';
import { Breadcrumb } from 'components/breadcrumbs';

interface PageProps {
	maxWidth?: ContainerProps["maxWidth"];
	title: HeaderProps["title"];
	children: ReactChild;
	header?: HeaderProps;
	breadcrumbs?: Breadcrumb[];
}
