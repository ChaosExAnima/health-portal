import { OneToMany, ChildEntity } from 'typeorm';

import Content from './content';
import Meta from './meta';

import type File from './file';

@ChildEntity()
export default class Note extends Content {
	get description(): string {
		return this.info;
	}

	@OneToMany( 'File', 'note' )
	files: Promise< File[] >;
}

@ChildEntity()
export class NoteMetaDue extends Meta {
	get value(): Date {
		return new Date( this.rawValue );
	}

	set value( val: Date ) {
		this.rawValue = Date.toString();
	}
}

@ChildEntity()
export class NoteMetaResolved extends Meta {
	get value(): boolean {
		return this.rawValue === 'true';
	}

	set value( val: boolean ) {
		this.rawValue = val ? 'true' : 'false';
	}
}
