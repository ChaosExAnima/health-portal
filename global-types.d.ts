import { SxProps } from '@mui/material';
import { JsonValue, Schema } from 'type-fest';
import {
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import { Entity } from 'lib/entities/types';

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
type Serialized< T > = Schema< T, JsonValue >;

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

type GetSinglePageContext = GetStaticPropsContext< SinglePageContext >;
type GetSinglePageResult< T extends Entity > = Promise<
	GetStaticPropsResult< Serialized< T > >
>;

type onChangeFunc = ( value: string ) => void;
