import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
	Box,
	Button,
	ButtonBaseProps,
	Fab,
	Grid,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import ButtonLink from 'components/button-link';

type ActionItemIcon = 'add' | 'edit' | 'save' | 'cancel' | React.ReactElement;

export type ActionItem = Omit<
	ButtonBaseProps,
	'href' | 'color' | 'action'
> & {
	href?: string;
	action: string;
	icon: ActionItemIcon;
	color?: 'primary' | 'secondary';
};

export interface HeaderProps {
	title?: string;
	subtitle?: string;
	actions?: ActionItem[];
	buttonsBelow?: true;
	edit?: true;
	onChange?: ( value: string ) => void;
}

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

const HeaderTitle: React.FC< HeaderProps > = ( {
	title,
	subtitle,
	edit,
	onChange,
} ) => {
	if ( edit ) {
		return (
			<TextField
				error={ ! title }
				onChange={ ( event ) =>
					onChange && onChange( event.target.value )
				}
				placeholder="Title"
				value={ title }
				InputProps={ { sx: { fontSize: 'h4.fontSize' } } }
			/>
		);
	}
	return (
		<>
			{ subtitle && (
				<Typography variant="caption" component="h2" color="grey.400">
					{ subtitle }
				</Typography>
			) }
			<Typography variant="h4" component="h1">
				{ title }
			</Typography>
		</>
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
	actions = [],
	...titleProps
} ) => (
	<>
		<HeaderTitle { ...titleProps } />
		{ actions.length && (
			<Box mt={ 3 }>
				<Grid container spacing={ 2 }>
					{ actions.map( ( action ) => (
						<Grid item key={ action.action }>
							<HeaderButton { ...action } />
						</Grid>
					) ) }
				</Grid>
			</Box>
		) }
	</>
);

const HeaderFab: React.FC< ActionItem > = React.forwardRef(
	( { icon, action, color = 'primary', ...props }, ref ) => (
		<Tooltip title={ action }>
			<Fab aria-label={ action } color={ color } { ...props } ref={ ref }>
				<ActionIcon icon={ icon } />
			</Fab>
		</Tooltip>
	)
);

const HeaderButtonsSide: React.FC< HeaderProps > = ( {
	actions = [],
	...titleProps
} ) => (
	<Grid container spacing={ 4 }>
		<Grid item>
			<HeaderTitle { ...titleProps } />
		</Grid>
		{ actions.map( ( { href, ...props } ) => (
			<Grid item key={ props.action }>
				{ href ? (
					<Link href={ href } passHref>
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
