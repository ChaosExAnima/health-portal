import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse< NewResponse >
) {
	const callSchema = yup.object().shape( {

	} );
}
