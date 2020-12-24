import {
	Box,
	Fab,
	Grid,
	Tooltip,
	Typography,
} from '@material-ui/core';
import Link from 'next/link';

export type ActionItem = {
	href: string;
	action: string;
	icon: React.ReactElement;
	color?: 'primary' | 'secondary';
};

type HeaderProps = {
	title: string;
	actions: ActionItem[];
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
								{ icon }
							</Tooltip>
						</Fab>
					</Link>
				</Grid>
			) ) }
		</Grid>
	</Box>
);

export default Header;
