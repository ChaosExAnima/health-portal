import { IconButton, IconButtonProps } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function ClearButton( props: IconButtonProps ) {
	return (
		<IconButton
			size="small"
			aria-label="Clear field"
			{ ...props }
			sx={ {
				position: 'absolute',
				right: 0,
				bottom: 0,
				margin: 1,
				...props.sx,
			} }
		>
			<Close />
		</IconButton>
	);
}
