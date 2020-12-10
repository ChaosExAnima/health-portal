import clsx from 'clsx';
import { useState } from 'react';

type HoverFC = React.FC<{ hoverClass?: string } & React.HTMLAttributes<HTMLDivElement>>;

const Hover: HoverFC = ( { children, hoverClass = 'hover', className } ) => {
	const [ isHovering, setHover ] = useState( false );
	return (
		<div
			className={ clsx( className, { [ hoverClass ]: isHovering } ) }
			onMouseEnter={ () => setHover( true ) }
			onMouseLeave={ () => setHover( false ) }
		>
			{ children }
		</div>
	);
};

export default Hover;
