import { TextField } from '@mui/material';
import { uniq } from 'lodash';
import { ChangeEvent, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

import ClearButton from './clear-button';
import TermFieldChips from './chips';

import { FormTermFieldProps, Input } from '../types';

export default function FormTermField< Schema extends Input >( {
	control,
	required,
	name,
	unique = true,
	format = ( term ) => term,
	color,
	label,
	...fieldProps
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

	const setTermsSafe = ( newTerms: string[] = [] ) => {
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
	const shrink = hasFocus || !! terms.length || !! text;

	const focusProps = {
		onFocus: () => setFocus( true ),
		onBlur: () => setFocus( false ),
	} as const;

	fieldProps.InputProps = {
		...fieldProps.InputProps,
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
				{ ...focusProps }
			/>
		),
		endAdornment: !! terms.length && (
			<ClearButton onClick={ () => setTermsSafe() } { ...focusProps } />
		),
	};

	return (
		<TextField
			{ ...focusProps }
			{ ...fieldProps }
			name={ name }
			value={ text }
			label={ label }
			error={ !! error }
			focused={ hasFocus }
			onChange={ onChange }
			onKeyDown={ onKeyDown }
			helperText={ error?.message ?? ' ' }
			placeholder={
				fieldProps.placeholder ?? 'Enter or comma to insert tag'
			}
			inputRef={ ( element: HTMLInputElement ) => {
				ref( element );
				inputRef.current = element;
			} }
			InputLabelProps={ {
				...fieldProps.InputLabelProps,
				shrink,
			} }
		/>
	);
}
