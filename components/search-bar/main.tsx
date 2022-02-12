import React, { useState } from 'react';
import {
	Autocomplete,
	Popper,
	PopperProps,
	CircularProgress,
	TextField,
	Box,
	AutocompleteRenderInputParams,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import styles from './styles';
import { SearchBarProps } from './types';

export default function MainSearchBar( {
	inputId = 'search',
	options,
}: SearchBarProps ) {
	const [ open, setOpen ] = useState( false );
	const loading = open && options.length === 0;

	const PopperComponent = ( props: PopperProps ) => (
		<Popper
			placement="bottom-start"
			style={ { width: '100%' } }
			{ ...props }
		/>
	);
	const renderInput = ( params: AutocompleteRenderInputParams ) => (
		<TextField
			{ ...params }
			variant="outlined"
			margin="none"
			placeholder="Search"
			sx={ { color: 'inherit' } }
			inputProps={ {
				...params.inputProps,
			} }
			fullWidth={ false }
			InputProps={ {
				...params.InputProps,
				sx: styles.input,
				startAdornment: <SearchIcon />,
				endAdornment: (
					<>
						{ loading && (
							<CircularProgress color="inherit" size="20" />
						) }
						{ params.InputProps.endAdornment }
					</>
				),
			} }
		/>
	);

	return (
		<Box sx={ styles.root }>
			<Autocomplete
				// Data
				sx={ styles.search }
				freeSolo
				options={ options }
				clearOnEscape
				getOptionLabel={ ( { title } ) => title }
				// Popper
				PopperComponent={ PopperComponent }
				disablePortal
				open={ open }
				onOpen={ () => setOpen( true ) }
				onClose={ () => setOpen( false ) }
				// Input
				id={ inputId }
				renderInput={ renderInput }
			/>
		</Box>
	);
}
