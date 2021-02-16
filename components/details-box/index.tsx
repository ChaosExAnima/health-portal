import React from 'react';
import {
	Box,
	Paper,
	Grid,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core';

type onChangeRootFunc = ( key: string, value: string ) => void;
type DetailsContextType = {
	edit: boolean;
	onChange?: onChangeRootFunc;
};
type DetailsBoxProps = (
	| { edit?: never; onChange?: never; }
	| { edit: true; onChange: onChangeRootFunc; }
);

export const DetailsContext = React.createContext<DetailsContextType>( {
	edit: false,
} );

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	detailsContainer: {
		padding: theme.spacing( 2 ),
	},
} ) );

const DetailsBox: React.FC<DetailsBoxProps> = ( {
	edit,
	children,
	onChange,
} ) => {
	const classes = useStyles();
	const context: DetailsContextType = {
		edit: edit || false,
		onChange,
	};
	return (
		<Box my={ 4 }>
			<Grid component={ Paper } container className={ classes.detailsContainer } spacing={ 2 }>
				<DetailsContext.Provider value={ context }>
					{ children }
				</DetailsContext.Provider>
			</Grid>
		</Box>
	);
};

import Detail from './detail';
export { Detail };

export default DetailsBox;
