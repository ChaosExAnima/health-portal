export default function format( amount: number, currency = false ): string {
	let formatOptions = {};
	if ( currency ) {
		formatOptions = { style: 'currency', currency: 'USD' };
	}
	return new Intl.NumberFormat( 'en-US', formatOptions ).format( amount );
}
