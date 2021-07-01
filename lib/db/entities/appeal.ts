import { ChildEntity, Column } from 'typeorm';

import Content from './content';

@ChildEntity()
export default class Appeal extends Content {
	@Column()
	status: string;
}
