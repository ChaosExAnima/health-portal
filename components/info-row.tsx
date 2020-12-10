import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import OptionalLink from 'components/optional-link';

import type { NextURL } from 'global-types';

type InfoRowProps = {
	info: React.ReactNode;
	value: React.ReactNode;
	href?: NextURL;
}

const useStyles = makeStyles( ( theme: Theme ) => createStyles( {
	panel: ( { href }: InfoRowProps ) => ( {
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

const InfoRow = ( props: InfoRowProps ) => {
	const { info, value, href } = props;
	const styles = useStyles( props );
	return (
		<Grid container item spacing={ 4 } className={ styles.panel }>
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
		</Grid>
	);
};

export default InfoRow;
