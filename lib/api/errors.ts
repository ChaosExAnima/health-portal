export class StatusError extends Error {
	public status: number;

	constructor( message?: string, status = 500 ) {
		super( message );
		this.status = status;
	}
}

export class NotFoundError extends StatusError {
	constructor() {
		super( 'Not found', 404 );
	}
}
