import React, { useState } from 'react';
import { Box, Drawer, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import styles from './styles';
import { SearchBarProps } from './types';

export default function MinimizedSearchBar( {}: SearchBarProps ) {
	const [ searchOpen, setSearchOpen ] = useState( false );
	return (
		<>
			<IconButton onClick={ () => setSearchOpen( true ) } size="large">
				<SearchIcon />
			</IconButton>
			<Drawer
				anchor="top"
				open={ searchOpen }
				onClose={ () => setSearchOpen( false ) }
			>
				<Box sx={ styles.search }>
					<Box sx={ styles.searchIcon }>
						<SearchIcon />
					</Box>
					<InputBase
						placeholder="Search…"
						sx={ Object.assign(
							{},
							styles.inputRoot,
							styles.input
						) }
						inputProps={ { 'aria-label': 'search' } }
					/>
				</Box>
			</Drawer>
		</>
	);
}
