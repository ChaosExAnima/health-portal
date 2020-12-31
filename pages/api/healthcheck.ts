import type { NextApiHandler } from 'next';

const handler: NextApiHandler<'okay!'> = ( req, res ) => {
	// This doesn't do anything itself, but lets
	// Docker check if this server is still alive.
	res.status( 200 ).send( 'okay!' );
};

export default handler;
