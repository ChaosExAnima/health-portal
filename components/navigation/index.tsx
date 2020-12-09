import { useState } from 'react';
import { AppBar, Drawer, IconButton, List, ListSubheader, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/menu';

import navigation from 'pages/navigation';
import NavItemLink from './nav-item-link';

import type { NavigationProps } from './index.d';

const useStyles = makeStyles( {
	list: {
		width: 250,
	},
} );

export default function Navigation( { title }: NavigationProps ) {
	const classes = useStyles();
	const [ isDrawerOpen, openDrawer ] = useState( false );

	const toggleDrawer = ( event: React.MouseEvent | React.KeyboardEvent ) => {
		if ( event instanceof KeyboardEvent && event.type === 'keydown' && ( event.key === 'Tab' || event.key === 'Shift' ) ) {
			return;
		}
		openDrawer( ! isDrawerOpen );
	};

	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton edge="start" color="inherit" aria-label="menu" onClick={ toggleDrawer }>
					<MenuIcon />
				</IconButton>
				{ title && (
					<Typography variant="h6">
						{ title }
					</Typography>
				) }
			</Toolbar>
			<Drawer open={ isDrawerOpen } onClose={ toggleDrawer }>
				<div
					className={ classes.list }
					role="presentation"
					onClick={ toggleDrawer }
					onKeyDown={ toggleDrawer }
				>
					<List
						aria-labelledby="drawer-header"
						subheader={
							<ListSubheader component="div" id="drawer-header">
								Welcome!
							</ListSubheader>
						}
					>
						{ navigation.map( ( navItem ) => <NavItemLink { ...navItem } key={ navItem.href } /> ) }
					</List>
				</div>
			</Drawer>
		</AppBar>
	);
}
