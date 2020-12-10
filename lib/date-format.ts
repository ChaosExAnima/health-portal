export default function( rawDate: number | string | Date ): string {
	let date: Date;
	if ( rawDate instanceof Date ) {
		date = rawDate;
	} else {
		date = new Date( rawDate );
	}
	return Intl.DateTimeFormat( 'en-US' ).format( date );
}
