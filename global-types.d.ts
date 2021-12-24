import { GetStaticProps } from 'next';
import { Entity } from 'lib/entities/types';

export type Optional< T, K extends keyof T > = Omit< T, K > & Partial< T >;
export type Nullable< T > = T | null;
export type StringKeys< T > = Extract< keyof T, string >;

export type PaginatedPageContext = {
	page: string;
}
export type SinglePageContext = {
	slug: string;
};

export type PageProps = {
	title: string;
};

export type PaginatedPageProps< T extends Entity > = PageProps & {
	currentPage: number;
	totalPages: number;
	records: T[];
};

export type SinglePageProps< T extends Entity > = PageProps & {
	id: number;
	slug: string;
	record: T;
};

export type GetSinglePageProps< T extends Entity > = GetStaticProps< SinglePageProps< T >, SinglePageContext >;

export type onChangeFunc = ( value: string ) => void;
