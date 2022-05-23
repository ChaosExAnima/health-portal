import Content from './content';

import type { ContentDB } from 'lib/db/types';

export default class Note extends Content {
	public description: string;
	public due?: Date;
	public resolved: boolean;

	public get isOverdue(): boolean {
		return !! this.due && this.due >= new Date();
	}

	public loadFromDB( row: ContentDB ): this {
		this.description = String( row.info );
		if ( row.identifier ) {
			this.due = new Date( row.identifier );
		}
		this.resolved = !! row.status;
		return super.loadFromDB( row );
	}
}
