import { IconButton, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { uniq } from 'lodash';
import { ChangeEvent, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import TermFieldChips from './chips';

import { FormTermFieldProps, Input } from '../types';

export default function FormTermField< Schema extends Input >( {
	control,
	required,
	name,
	unique = true,
	format = ( term ) => term,
	...TextFieldProps
}: FormTermFieldProps< Schema > ) {
	const {
		field: { onChange: onChangeForm, ref },
		fieldState: { error },
	} = useController( {
		control,
		name,
		rules: { required },
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
		inputRef.current?.focus();
		setFocus( true );
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
				setFocus( false );
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
				sx: {
					flexWrap: 'wrap',
					gap: 1,
					paddingTop: 2,
					'& > input': {
						paddingTop: 0,
					},
				},
				startAdornment: (
					<TermFieldChips
						terms={ terms }
						setTerms={ setTermsSafe }
						inputRef={ inputRef }
					/>
				),
				endAdornment: !! terms.length && (
					<IconButton
						aria-label="Clear field"
						size="small"
						onClick={ () => setTermsSafe( [] ) }
						sx={ {
							position: 'absolute',
							right: 0,
							bottom: 0,
							margin: 1,
						} }
					>
						<Close />
					</IconButton>
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
			helperText={ error?.message ?? ' ' }
			error={ !! error }
		/>
	);
}
