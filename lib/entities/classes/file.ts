import Content from './content';

import type { ContentDB, NewMetaDB } from 'lib/db/types';

export default class SavedFile extends Content {
	public url: string;
	public source: string;
	public mimeType?: string;

	public loadFromDB( row: ContentDB ): this {
		this.url = String( row.info );
		this.source = String( row.status );
		return super.loadFromDB( row );
	}

	public toDB(): ContentDB {
		const row = super.toDB();
		row.info = this.url;
		row.status = this.source;
		return row;
	}

	public setMeta( key: string, value?: string ): void {
		if ( key === 'mimeType' && value ) {
			this.mimeType = value;
		}
	}

	public toMeta(): NewMetaDB[] {
		return [ this.fillMeta( 'mimeType', this.mimeType ) ];
	}
}
