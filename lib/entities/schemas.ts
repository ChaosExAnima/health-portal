import { capitalize } from 'lodash';
import * as yup from 'yup';

import { Call } from './types';

export const callSchema: yup.ObjectSchema< NewCallInput > = yup
	.object( {
		date: yup.date().default( () => new Date() ),
		provider: yup
			.object( {
				id: yup.number().min( 0 ).required(),
				name: yup.string().trim().required(),
			} )
			.required(),
		reps: yup
			.array()
			.of( yup.string().required().trim().transform( capitalize ) )
			.ensure()
			.compact(),
		reason: yup.string().required(),
		reference: yup.string().trim(),
		result: yup.string().trim().required(),
		claims: yup.array( yup.number().required() ).ensure().required(),
	} )
	.required();
