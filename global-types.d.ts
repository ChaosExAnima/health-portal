import { GetStaticProps } from 'next';
import { Entity } from 'lib/entities/types';

type Optional< T, K extends keyof T > = Omit< T, K > & Partial< T >;
type Nullable< T > = T | null;
type StringKeys< T > = Extract< keyof T, string >;
type MaybeArray< T > = T | T[];
type StringMap = Record< string, string >;

type PaginatedPageContext = {
	page: string;
}
type SinglePageContext = {
	slug: string;
};

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
	record: T;
};

type GetSinglePageProps< T extends Entity > = GetStaticProps< SinglePageProps< T >, SinglePageContext >;

type onChangeFunc = ( value: string ) => void;
