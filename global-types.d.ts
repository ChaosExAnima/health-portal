import { SxProps } from '@mui/material';
import { JsonValue, Primitive, Schema } from 'type-fest';

// Primitives
type PlainObject = Record< string, Primitive >;
type StringMap = Record< string, string >;
type StyleMap = Record< string, SxProps< Theme > >;

// Utils
type Nullable< T > = T | null;
type StringKeys< T > = Extract< keyof T, string >;
type MaybeArray< T > = T | T[];
type DeepReplace< T, From, To > = T extends ( ...args: any[] ) => any
	? T
	: {
			[ K in keyof T ]: [ T[ K ], From ] extends [ From, T[ K ] ]
				? To
				: Replace< T[ K ], From, To >;
	  };
type Serialized< T > = Schema< T, JsonValue >;

type onChangeFunc = ( value: string ) => void;
