import { useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useController } from 'react-hook-form';

import { useDebouncedSWR } from 'lib/hooks';
import { filterOptions, getOptionLabel, isOptionObject } from './utils';

import type {
	FormAutocompleteFieldProps,
	AutocompleteResponse,
	Input,
} from '../types';

export default function AutocompleteField< Schema extends Input >( {
	control,
	free,
	label,
	multiple,
	name,
	target,
	required,
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

	const onChange = ( _event: never, option: unknown ) => {
		if ( isOptionObject( option ) ) {
			onChangeForm( { ...option, value: getOptionLabel( option ) } );
		}
	};

	return (
		<Autocomplete
			autoSelect
			clearOnEscape
			freeSolo={ free }
			getOptionLabel={ getOptionLabel }
			isOptionEqualToValue={ ( option, selectedValue: string ) =>
				!! selectedValue &&
				isOptionObject( option ) &&
				option.label === selectedValue
			}
			filterOptions={ filterOptions }
			loading={ loading }
			multiple={ multiple }
			options={ response?.success ? response.options : [] }
			onChange={ onChange }
			noOptionsText="Not found"
			renderOption={ ( option: unknown ) =>
				isOptionObject( option )
					? option.label
					: getOptionLabel( option )
			}
			renderInput={ ( params ) => (
				<TextField
					{ ...params }
					name={ name }
					label={ label }
					error={ error || errorResponse }
					helperText={ error?.message ?? ' ' }
					inputRef={ ref }
					onChange={ ( event ) =>
						setSearchTerm( event.target.value )
					}
					value={ searchTerm }
					disabled={ isSubmitting }
					InputProps={ {
						...params.InputProps,
						endAdornment: (
							<>
								{ loading ? (
									<CircularProgress
										color="inherit"
										size={ 20 }
									/>
								) : null }
								{ params.InputProps.endAdornment }
							</>
						),
					} }
				/>
			) }
		/>
	);
}
