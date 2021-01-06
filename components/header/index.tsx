import {
	Box,
	Button,
	ButtonBaseProps,
	Fab,
	Grid,
	Tooltip,
	Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ButtonLink from 'components/button-link';
import Link from 'next/link';
import React from 'react';

type ActionItemIcon = 'add' | 'edit' | React.ReactElement;

export type ActionItem = Omit<ButtonBaseProps, 'href' | 'color' | 'action'> & {
	href?: string;
	action: string;
	icon: ActionItemIcon;
	color?: 'default' | 'primary' | 'secondary';
};

type HeaderProps = {
	title: string;
	actions: ActionItem[];
	buttonsBelow?: true;
};

const ActionIcon: React.FC<{ icon: ActionItemIcon }> = ( { icon } ) => {
	if ( icon === 'add' ) {
		return <AddIcon />;
	} else if ( icon === 'edit' ) {
		return <EditIcon />;
	}
	return icon;
};

const HeaderTitle: React.FC<Pick<HeaderProps, 'title'>> = ( { title } ) => (
	<Typography variant="h4" component="h1">
		{ title }
	</Typography>
);

const HeaderButton: React.FC<ActionItem> = ( { href, icon, action, color = 'primary', ...props } ) => (
	href
		? <ButtonLink
			href={ href }
			startIcon={ <ActionIcon icon={ icon } /> }
			color={ color }
			{ ...props }
		>{ action }</ButtonLink>
		: <Button
			startIcon={ <ActionIcon icon={ icon } /> }
			color={ color }
			{ ...props }
		>{ action }</Button>
);

const HeaderButtonsBelow: React.FC<Pick<HeaderProps, 'actions' | 'title'>> = ( { actions, title } ) => (
	<>
		<HeaderTitle title={ title } />
		<Box mt={ 3 }>
			<Grid container spacing={ 2 }>
				{ actions.map( ( action ) => (
					<Grid item key={ action.action }>
						<HeaderButton { ...action } />
					</Grid>
				) ) }
			</Grid>
		</Box>
	</>
);

const HeaderFab: React.FC<ActionItem> = ( { icon, action, color = 'primary', ...props } ) => (
	<Tooltip title={ action }>
		<Fab aria-label={ action } color={ color } { ...props }>
			<ActionIcon icon={ icon } />
		</Fab>
	</Tooltip>
);

const HeaderButtonsSide: React.FC<Pick<HeaderProps, 'actions' | 'title'>> = ( { actions, title } ) => (
	<Grid container spacing={ 4 }>
		<Grid item>
			<HeaderTitle title={ title } />
		</Grid>
		{ actions.map( ( { href, ...props } ) => (
			<Grid item key={ props.action }>
				{
					href
						? <Link href={ href }><HeaderFab { ...props } /></Link>
						: <HeaderFab { ...props } />
				}
			</Grid>
		) ) }
	</Grid>
);

const Header: React.FC<HeaderProps> = ( { buttonsBelow, ...props } ) => (
	<Box my={ 4 }>
		{ buttonsBelow
			? <HeaderButtonsBelow { ...props } />
			: <HeaderButtonsSide { ...props } />
		}
	</Box>
);

export default Header;
