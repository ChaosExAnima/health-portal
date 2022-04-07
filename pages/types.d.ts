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
interface PageProps {
	title: string;
}
interface PaginatedPageProps< T extends Entity > extends PageProps {
	currentPage: number;
	totalPages: number;
	records: T[];
	query?: ParsedUrlQuery;
}
interface SinglePageProps< T extends Entity > extends PageProps {
	id: number;
	slug: string;
	record: T;
}
interface SingleEditPageProps< T extends Entity > extends SinglePageProps< T > {
	originalTitle: string;
}
type GetSinglePageProps< T extends Entity > = GetStaticProps<
	SinglePageProps< T >,
	SinglePageContext
>;

// Returns
type GetPaginatedPageResult< T extends Entity > = Promise<
	GetStaticPropsResult< PaginatedPageProps< WithTimestamps< T > > >
>;
type GetSinglePageResult< T extends Entity > = Promise<
	GetStaticPropsResult< SinglePageProps< T > >
>;
type GetSingleEditPageResult< T extends Entity > = Promise<
	GetStaticPropsResult< SingleEditPageProps< T > >
>;

// Helpers
type WithTimestamps< I > = Replace< I, Date, Timestamp >;
