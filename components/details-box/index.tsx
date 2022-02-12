import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Grid, Theme } from '@mui/material';

type onChangeRootFunc = ( key: string, value: string ) => void;
type DetailsContextType = {
	edit: boolean;
	onChange?: onChangeRootFunc;
};
type DetailsBoxProps =
	| { edit?: never; onChange?: never }
	| { edit: true; onChange: onChangeRootFunc };

export const DetailsContext = React.createContext< DetailsContextType >( {
	edit: false,
} );

const DetailsBox: React.FC< DetailsBoxProps > = ( {
	edit,
	children,
	onChange,
} ) => {
	const context: DetailsContextType = {
		edit: edit || false,
		onChange,
	};
	return (
		<StyledBox my={ 4 }>
			<Grid
				component={ Paper }
				container
				className={ classes.detailsContainer }
				spacing={ 2 }
			>
				<DetailsContext.Provider value={ context }>
					{ children }
				</DetailsContext.Provider>
			</Grid>
		</StyledBox>
	);
};

import Detail from './detail';
const PREFIX = 'DetailsBox';

const classes = {
	detailsContainer: `${ PREFIX }-detailsContainer`,
};

const StyledBox = styled( Box )( ( { theme } ) => ( {
	[ `& .${ classes.detailsContainer }` ]: {
		padding: theme.spacing( 2 ),
	},
} ) );

export { Detail };

export default DetailsBox;
