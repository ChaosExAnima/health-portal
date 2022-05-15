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
type Replace< T, A, B > = T extends A
	? B
	: T extends {}
	? { [ K in keyof T ]: Replace< T[ K ], A, B > }
	: T;

type onChangeFunc = ( value: string ) => void;
