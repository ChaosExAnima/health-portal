import {
	Box,
	Button,
	ButtonBaseProps,
	createStyles,
	Fab,
	Grid,
	makeStyles,
	TextField,
	Theme,
	Tooltip,
	Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import ButtonLink from 'components/button-link';
import Link from 'next/link';
import React from 'react';

type ActionItemIcon = 'add' | 'edit' | 'save' | 'cancel' | React.ReactElement;

export type ActionItem = Omit<
	ButtonBaseProps,
	'href' | 'color' | 'action'
> & {
	href?: string;
	action: string;
	icon: ActionItemIcon;
	color?: 'default' | 'primary' | 'secondary';
};

type HeaderProps = {
	title: string;
	actions: ActionItem[];
	buttonsBelow?: true;
	edit?: true;
	onChange?: ( value: string ) => void;
};

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		editTitle: {
			fontSize: theme.typography.h4.fontSize,
		},
	} )
);

const ActionIcon: React.FC< { icon: ActionItemIcon } > = ( { icon } ) => {
	if ( icon === 'add' ) {
		return <AddIcon />;
	} else if ( icon === 'edit' ) {
		return <EditIcon />;
	} else if ( icon === 'save' ) {
		return <SaveIcon />;
	} else if ( icon === 'cancel' ) {
		return <CancelIcon />;
	}
	return icon;
};

const HeaderTitle: React.FC<
	Pick< HeaderProps, 'title' | 'edit' | 'onChange' >
> = ( { title, edit, onChange } ) => {
	const classes = useStyles();
	if ( edit ) {
		return (
			<TextField
				error={ ! title }
				fullWidth
				onChange={ ( event ) =>
					onChange && onChange( event.target.value )
				}
				placeholder="Title"
				value={ title }
				InputProps={ { className: classes.editTitle } }
			/>
		);
	}
	return (
		<Typography variant="h4" component="h1">
			{ title }
		</Typography>
	);
};

const HeaderButton: React.FC< ActionItem > = ( {
	href,
	icon,
	action,
	color = 'primary',
	...props
} ) =>
	href ? (
		<ButtonLink
			href={ href }
			startIcon={ <ActionIcon icon={ icon } /> }
			color={ color }
			{ ...props }
		>
			{ action }
		</ButtonLink>
	) : (
		<Button
			startIcon={ <ActionIcon icon={ icon } /> }
			color={ color }
			{ ...props }
		>
			{ action }
		</Button>
	);

const HeaderButtonsBelow: React.FC< HeaderProps > = ( {
	actions,
	title,
	edit,
	onChange,
} ) => (
	<>
		<HeaderTitle title={ title } edit={ edit } onChange={ onChange } />
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

const HeaderFab: React.FC< ActionItem > = ( {
	icon,
	action,
	color = 'primary',
	...props
} ) => (
	<Tooltip title={ action }>
		<Fab aria-label={ action } color={ color } { ...props }>
			<ActionIcon icon={ icon } />
		</Fab>
	</Tooltip>
);

const HeaderButtonsSide: React.FC<
	Pick< HeaderProps, 'actions' | 'title' >
> = ( { actions, title } ) => (
	<Grid container spacing={ 4 }>
		<Grid item>
			<HeaderTitle title={ title } />
		</Grid>
		{ actions.map( ( { href, ...props } ) => (
			<Grid item key={ props.action }>
				{ href ? (
					<Link href={ href }>
						<HeaderFab { ...props } />
					</Link>
				) : (
					<HeaderFab { ...props } />
				) }
			</Grid>
		) ) }
	</Grid>
);

const Header: React.FC< HeaderProps > = ( { buttonsBelow, ...props } ) => (
	<Box my={ 4 }>
		{ buttonsBelow ? (
			<HeaderButtonsBelow { ...props } />
		) : (
			<HeaderButtonsSide { ...props } />
		) }
	</Box>
);

export default Header;
