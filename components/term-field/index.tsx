import { TextField } from '@material-ui/core';
import { uniq } from 'lodash';
import { ChangeEvent, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import TermFieldChips from './chips';

import { TermFieldProps } from './types';

export default function TermField( {
	control,
	required,
	name,
	unique = true,
	format = ( term ) => term,
	...TextFieldProps
}: TermFieldProps ) {
	const {
		field: { onChange: onChangeForm, ref },
	} = useController( {
		control,
		name,
		rules: { required },
		defaultValue: [],
	} );
	const [ terms, setTerms ] = useState< string[] >( [] );
	const [ text, setText ] = useState( '' );
	const [ hasFocus, setFocus ] = useState( false );
	const inputRef = useRef< HTMLInputElement | null >( null );

	const setTermsSafe = ( newTerms: string[] ) => {
		const filteredTerms = newTerms
			.map( format )
			.filter( Boolean ) as string[];
		const uniqueTerms = unique ? uniq( filteredTerms ) : filteredTerms;
		setTerms( uniqueTerms );
		onChangeForm( uniqueTerms );
		setText( '' );
	};
	const onKeyDown = ( event: React.KeyboardEvent< HTMLInputElement > ) => {
		switch ( event.key ) {
			case 'Enter':
			case ',':
				event.preventDefault();
				setTermsSafe( [ ...terms, text ] );
				break;
			case 'Escape':
				setText( '' );
				inputRef.current?.blur();
				break;
			case 'Tab':
				setText( '' );
		}
	};
	const onChange = ( event: ChangeEvent< HTMLInputElement > ) => {
		setText( event.target.value );
	};

	return (
		<TextField
			{ ...TextFieldProps }
			name={ name }
			inputRef={ ( element: HTMLInputElement ) => {
				ref( element );
				inputRef.current = element;
			} }
			InputProps={ {
				...TextFieldProps.InputProps,
				startAdornment: (
					<TermFieldChips
						terms={ terms }
						setTerms={ setTermsSafe }
						inputRef={ inputRef }
					/>
				),
			} }
			InputLabelProps={ {
				...TextFieldProps.InputLabelProps,
				shrink: !! terms.length || !! text || hasFocus,
			} }
			onKeyDown={ onKeyDown }
			onChange={ onChange }
			value={ text }
			onFocus={ () => setFocus( true ) }
			onBlur={ () => setFocus( false ) }
		/>
	);
}
