export type Optional< T, K extends keyof T > = Omit< T, K > & Partial< T >;

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
