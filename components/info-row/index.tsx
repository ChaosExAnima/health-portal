import { Grid, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

import OptionalLink from 'components/optional-link';

const StyledGrid = styled( Grid )( ( { theme } ) => ( {
	[ `&` ]: ( { href }: InfoRowProps ) => ( {
		'& > div': {
			transition: theme.transitions.create( 'background-color', {
				duration: theme.transitions.duration.standard,
			} ),
			cursor: href ? 'pointer' : 'inherit',
		},
		'&:hover > div': {
			'background-color': href ? theme.palette.primary.dark : 'inherit',
		},
	} ),
} ) );

type InfoRowProps = {
	info: React.ReactNode;
	value: React.ReactNode;
	href?: string;
};

const InfoRow: React.FC< InfoRowProps > = ( props ) => {
	const { info, value, href } = props;

	return (
		<StyledGrid container item spacing={ 4 }>
			<Grid item sm={ 3 }>
				<OptionalLink href={ href }>
					<Typography variant="body1" component="p">
						{ info }
					</Typography>
				</OptionalLink>
			</Grid>
			<Grid item xs={ 12 } sm>
				<OptionalLink href={ href }>
					<Typography variant="h4" component="p">
						{ value }
					</Typography>
				</OptionalLink>
			</Grid>
		</StyledGrid>
	);
};

export default InfoRow;
