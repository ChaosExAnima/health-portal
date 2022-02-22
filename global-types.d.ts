import { SxProps } from '@mui/material';
import { JsonValue, Opaque, Primitive, Schema } from 'type-fest';

// Primitives
type PlainObject = Record< string, any >;
type StringMap = Record< string, string >;
type StyleMap = Record< string, SxProps< Theme > >;
type Timestamp = Opaque< string, 'Timestamp' >;

// Utils
type Nullable< T > = T | null;
type StringKeys< T > = Extract< keyof T, string >;
type MaybeArray< T > = T | T[];
type Replace< T, From, To > = T extends object
	? {
			[ key in keyof T ]: T[ key ] extends From
				? To
				: Replace< T[ key ], From, To >;
	  }
	: T;
type DeepReplace< T, From, To > = T extends ( ...args: any[] ) => any
	? T
	: {
			[ K in keyof T ]: [ T[ K ], From ] extends [ From, T[ K ] ]
				? To
				: DeepReplace< T[ K ], From, To >;
	  };

type onChangeFunc = ( value: string ) => void;
