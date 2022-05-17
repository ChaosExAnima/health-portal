import { EntityInput, NoteInput } from '../types';
import Content from './content';

export default class Note extends Content {
	public description: string;
	public due?: Date;
	public resolved?: boolean;

	public get isOverdue(): boolean {
		return !! this.due && this.due >= new Date();
	}

	protected setFromMeta( key: string, value: any ): void {}
	// files?: FileEntity[];
}
