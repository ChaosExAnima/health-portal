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

export type PaginatedPageProps = PageProps & {
	currentPage: number;
};

export type SinglePageProps = PageProps & {
	id: number;
	slug: string;
};

export type onChangeFunc = ( value: string ) => void;
