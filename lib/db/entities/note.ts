import { Column, OneToMany, ChildEntity } from 'typeorm';

import Content from './content';

import type File from './file';
import Meta from './meta';

@ChildEntity()
export default class Note extends Content {
	get description(): string {
		return this.info;
	}

	@OneToMany( 'File', 'note' )
	files: Promise< File[] >;
}

@ChildEntity()
export class NoteMetaDue extends Meta< Note > {
	@Column( { type: 'varchar' } )
	value: Date;
}

@ChildEntity()
export class NoteMetaResolved extends Meta< Note > {
	@Column( { type: 'varchar' } )
	value = false;
}
