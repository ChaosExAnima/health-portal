import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
	Autocomplete,
	Drawer,
	alpha,
	IconButton,
	InputBase,
	Popper,
	PopperProps,
	CircularProgress,
	TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const PREFIX = 'SearchBar';

const classes = {
	search: `${ PREFIX }-search`,
	searchIcon: `${ PREFIX }-searchIcon`,
	inputRoot: `${ PREFIX }-inputRoot`,
	inputInput: `${ PREFIX }-inputInput`,
	inputPopper: `${ PREFIX }-inputPopper`,
};

const StyledSearch = styled( 'div' )( ( { theme } ) => ( {
	[ `&` ]: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		marginLeft: 0,
		width: '100%',
		[ theme.breakpoints.up( 'sm' ) ]: {
			marginLeft: theme.spacing( 1 ),
			width: 'auto',
			backgroundColor: alpha( theme.palette.common.white, 0.15 ),
			'&:hover': {
				backgroundColor: alpha( theme.palette.common.white, 0.25 ),
			},
		},

		'& svg': {
			color: theme.palette.primary.light,
		},
		'&:hover svg': {
			color: 'inherit',
		},
	},

	[ `& .${ classes.searchIcon }` ]: {
		padding: theme.spacing( 0, 2 ),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	[ `& .${ classes.inputRoot }` ]: {
		color: 'inherit',
	},

	[ `& .${ classes.inputInput }` ]: {
		padding: theme.spacing( 0, 1, 0, 0 ),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${ theme.spacing( 4 ) }px)`,
		transition: theme.transitions.create( 'width' ),
		width: '100%',
		[ theme.breakpoints.up( 'sm' ) ]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},

	[ `& .${ classes.inputPopper }` ]: {
		width: '100% !important',
	},
} ) );

type SearchBarProps = {
	minimized?: boolean;
	inputId?: string;
	options: SearchOption[];
};

export type SearchOption = {
	title: string;
	href: string;
	type?: string;
};

const SearchBar: React.FC< SearchBarProps > = ( {
	minimized = false,
	inputId = 'search',
	options,
} ) => {
	const [ open, setOpen ] = useState( false );
	const loading = open && options.length === 0;

	if ( minimized ) {
		return <MinimizedSearchBar />;
	}

	const PopperComponent = ( props: PopperProps ) => (
		<Popper placement="bottom-start" { ...props } />
	);

	return (
		<StyledSearch>
			<div className={ classes.searchIcon }>
				<SearchIcon />
			</div>
			<Autocomplete
				// Data
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
				classes={ {
					popper: classes.inputPopper,
				} }
				// Input
				id={ inputId }
				renderInput={ ( params ) => (
					<TextField
						{ ...params }
						variant="outlined"
						margin="none"
						placeholder="Search…"
						className={ classes.inputRoot }
						inputProps={ {
							...params.inputProps,
							className: classes.inputInput,
						} }
						InputProps={ {
							...params.InputProps,
							endAdornment: (
								<>
									{ loading && (
										<CircularProgress
											color="inherit"
											size="20"
										/>
									) }
									{ params.InputProps.endAdornment }
								</>
							),
						} }
					/>
				) }
			/>
		</StyledSearch>
	);
};

const MinimizedSearchBar: React.FC = () => {
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
				<div className={ classes.search }>
					<div className={ classes.searchIcon }>
						<SearchIcon />
					</div>
					<InputBase
						placeholder="Search…"
						classes={ {
							root: classes.inputRoot,
							input: classes.inputInput,
						} }
						inputProps={ { 'aria-label': 'search' } }
					/>
				</div>
			</Drawer>
		</>
	);
};

export default SearchBar;
