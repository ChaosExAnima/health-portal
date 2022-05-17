import Content from './content';

import type { ContentDB } from 'lib/db/types';

export default class SavedFile extends Content {
	public url: string;
	public source: string;
	public mimeType?: string;

	public loadFromDB( row: ContentDB ): this {
		this.url = String( row.info );
		this.source = String( row.status );
		return super.loadFromDB( row );
	}
}
