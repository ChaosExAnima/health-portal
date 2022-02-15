import { useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useController } from 'react-hook-form';

import { useDebouncedSWR } from 'lib/hooks';
import {
	filterOptions,
	getOptionLabel,
	isNewOptionObject,
	isOptionObject,
} from './utils';

import type {
	FormAutocompleteFieldProps,
	AutocompleteResponse,
	Input,
	AutocompleteOption,
	AutocompleteOptions,
} from '../types';

export default function AutocompleteField< Schema extends Input >( {
	control,
	free = false,
	label,
	multiple = false,
	name,
	target,
	targetKey = 'name',
	required = false,
}: FormAutocompleteFieldProps< Schema > ) {
	const {
		field: { value, onChange: onChangeForm, ref },
		fieldState: { error },
		formState: { isSubmitting },
	} = useController( { control, name, rules: { required } } );
	const [ searchTerm, setSearchTerm ] = useState< string >( value || '' );
	const searchPath = searchTerm
		? `/api/search/${ target || name }/${ searchTerm }`
		: null;
	const {
		data: response,
		error: errorResponse,
	} = useDebouncedSWR< AutocompleteResponse >( searchPath );
	const loading = ! response && !! searchTerm;

	const onChange = ( _event: never, option: AutocompleteOptions ) => {
		if ( isOptionObject( option ) ) {
			if ( isNewOptionObject( option ) ) {
				option.label = option.value;
			}
			onChangeForm( { id: option.id, [ targetKey ]: option.label } );
		}
	};

	return (
		<Autocomplete<
			AutocompleteOption,
			typeof multiple,
			undefined,
			typeof free
		>
			autoSelect
			clearOnEscape
			freeSolo={ free }
			getOptionLabel={ getOptionLabel }
			filterOptions={ filterOptions }
			loading={ loading }
			multiple={ multiple }
			options={ response?.success ? response.options : [] }
			onChange={ onChange }
			noOptionsText="Not found"
			renderOption={ ( props, option ) => (
				<li { ...props }>{ option.label }</li>
			) }
			renderInput={ ( params ) => (
				<TextField
					{ ...params }
					name={ name }
					label={ label }
					placeholder="Type to show options"
					error={ !! error || !! errorResponse }
					helperText={ error?.message ?? ' ' }
					inputRef={ ref }
					onChange={ ( event ) =>
						setSearchTerm( event.target.value )
					}
					value={ searchTerm }
					disabled={ isSubmitting }
					InputProps={ {
						...params.InputProps,
						endAdornment: loading && (
							<CircularProgress color="inherit" size={ 20 } />
						),
					} }
				/>
			) }
		/>
	);
}
