import { ChildEntity } from 'typeorm';

import Content from './content';
import Meta from './meta';

@ChildEntity()
export default class Call extends Content {}

@ChildEntity()
export class CallMetaRep extends Meta {
	get value(): string {
		return this.rawValue;
	}

	set value( val: string ) {
		this.rawValue = val;
	}
}
