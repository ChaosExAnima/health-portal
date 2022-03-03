import {
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import { Entity } from 'lib/entities/types';
import { Timestamp, Replace } from 'global-types';
import { ParsedUrlQuery } from 'querystring';

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
	query?: ParsedUrlQuery;
};
type SinglePageProps< T extends Entity > = PageProps & {
	id: number;
	slug: string;
	record: T;
};
type SingleEditPageProps< T extends Entity > = SinglePageProps< T > & {
	originalTitle: string;
};
type GetSinglePageProps< T extends Entity > = GetStaticProps<
	SinglePageProps< T >,
	SinglePageContext
>;

// Returns
type GetPaginatedPageResult< T extends Entity > = Promise<
	GetStaticPropsResult< PaginatedPageProps< WithTimestamps< T > > >
>;
type GetSinglePageResult< T extends Entity > = Promise<
	GetStaticPropsResult< SinglePageProps< WithTimestamps< T > > >
>;
type GetSingleEditPageResult< T extends Entity > = Promise<
	GetStaticPropsResult< SingleEditPageProps< WithTimestamps< T > > >
>;

// Helpers
type WithTimestamps< I > = Replace< I, Date, Timestamp >;
