import {
	Box,
	Fab,
	Grid,
	Tooltip,
	Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import React from 'react';

type ActionItemIcon = 'add' | React.ReactElement;

export type ActionItem = {
	href: string;
	action: string;
	icon: ActionItemIcon;
	color?: 'primary' | 'secondary';
};

type HeaderProps = {
	title: string;
	actions: ActionItem[];
};

const ActionIcon: React.FC<{ icon: ActionItemIcon }> = ( { icon } ) => {
	if ( icon === 'add' ) {
		return <AddIcon />;
	}
	return icon;
};

const Header: React.FC<HeaderProps> = ( { actions, title } ) => (
	<Box my={ 4 }>
		<Grid container spacing={ 4 }>
			<Grid item>
				<Typography variant="h4" component="h1">
					{ title }
				</Typography>
			</Grid>
			{ actions.map( ( { href, action, color = 'primary', icon } ) => (
				<Grid item key={ href }>
					<Link href={ href }>
						<Fab color={ color } aria-label={ action }>
							<Tooltip title={ action }>
								<ActionIcon icon={ icon } />
							</Tooltip>
						</Fab>
					</Link>
				</Grid>
			) ) }
		</Grid>
	</Box>
);

export default Header;
