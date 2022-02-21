export class StatusError extends Error {
	public status: number;
	public name = 'StatusError';

	constructor( message?: string, status = 500 ) {
		super( message );
		this.status = status;
		this.name = `StatusError(${ status })`;
	}
}

export class NotFoundError extends StatusError {
	constructor() {
		super( 'Not found', 404 );
		this.name = 'NotFoundError';
	}
}
