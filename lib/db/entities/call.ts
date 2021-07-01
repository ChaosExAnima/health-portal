import { ChildEntity, Column } from 'typeorm';

import Content from './content';
import Meta from './meta';

@ChildEntity()
export default class Call extends Content {}

export class CallMetaRep extends Meta< Call > {
	@Column( { type: 'simple-array' } )
	reps: string[];
}
