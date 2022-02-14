import { GetStaticProps } from 'next';
import { Entity } from 'lib/entities/types';
import { SxProps } from '@mui/material';

// Utils
type Nullable< T > = T | null;
type StringKeys< T > = Extract< keyof T, string >;
type MaybeArray< T > = T | T[];
type StringMap = Record< string, string >;
type StyleMap = Record< string, SxProps< Theme > >;
type DeepReplace< T, From, To > = T extends ( ...args: any[] ) => any
	? T
	: {
			[ K in keyof T ]: [ T[ K ], From ] extends [ From, T[ K ] ]
				? To
				: Replace< T[ K ], From, To >;
	  };
type RemoveNever< T > = Pick<
	T,
	{
		[ P in keyof T ]: T[ P ] extends Function ? P : never;
	}[ keyof T ]
>;

// Contexts
type PaginatedPageContext = {
	page: string;
};
type SinglePageContext = {
	slug: string;
};

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
	record: T;
};

type GetSinglePageProps< T extends Entity > = GetStaticProps<
	SinglePageProps< T >,
	SinglePageContext
>;

type onChangeFunc = ( value: string ) => void;
