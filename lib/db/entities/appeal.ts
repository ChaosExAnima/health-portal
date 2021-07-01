import { ChildEntity } from 'typeorm';

import Content from './content';

@ChildEntity()
export default class Appeal extends Content {
	get name(): string {
		return this.identifier;
	}
}
