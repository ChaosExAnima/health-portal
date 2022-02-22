import {
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import { Entity } from 'lib/entities/types';
import { Timestamp } from 'global-types';

// Contexts
type PaginatedPageContext = {
	page: string;
};
type SinglePageContext = {
	slug: string;
};
type GetSinglePageContext = GetStaticPropsContext< SinglePageContext >;

// Props
type PageProps = {
	title: string;
};
type PaginatedPageProps< T extends Entity > = PageProps & {
	currentPage: number;
	totalPages: number;
	records: T[];
};
type SinglePageProps< T extends Entity > = PageProps & {
	id: number;
	slug: string;
	originalTitle?: string;
	record: T;
};
type GetSinglePageProps< T extends Entity > = GetStaticProps<
	SinglePageProps< T >,
	SinglePageContext
>;

// Returns
type GetSinglePageResult< T extends Entity > = Promise<
	GetStaticPropsResult< Replace< T, Date, Timestamp > >
>;
