import React from 'react';
import { Box, Paper, Grid } from '@mui/material';

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
		<Box my={ 4 }>
			<Grid
				component={ Paper }
				container
				sx={ { padding: 2 } }
				spacing={ 2 }
			>
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
