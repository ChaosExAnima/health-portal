import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { useController } from 'react-hook-form';

import { useDebouncedSWR } from 'lib/hooks';
import { filterOptions, getOptionLabel, isOptionObject } from './utils';

import type { AutocompleteProps, AutocompleteResponse } from './types';

export default function AutocompleteField( {
	control,
	free,
	label,
	multiple,
	name,
	required,
	target,
}: AutocompleteProps ) {
	const {
		field: { value, onChange: onChangeForm, ref },
	} = useController( { control, name, rules: { required } } );
	const [ searchTerm, setSearchTerm ] = useState< string >( value || '' );
	const searchPath = searchTerm
		? `/api/search/${ target || name }/${ searchTerm }`
		: null;
	const { data: response, error } = useDebouncedSWR< AutocompleteResponse >(
		searchPath
	);
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
			getOptionSelected={ ( option, selectedValue: string ) =>
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
			renderOption={ ( option ) =>
				isOptionObject( option )
					? option.label
					: getOptionLabel( option )
			}
			renderInput={ ( params ) => (
				<TextField
					{ ...params }
					name={ name }
					label={ label }
					error={ error }
					inputRef={ ref }
					onChange={ ( event ) =>
						setSearchTerm( event.target.value )
					}
					value={ searchTerm }
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
