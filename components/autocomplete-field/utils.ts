import type { FilterOptionsState } from '@material-ui/lab';
import type { AutocompleteOption, AutocompleteOptionNew } from './types';

/**
 * Checks whether this is an AutocompleteOption.
 *
 * @param {unknown} option An unknown object.
 * @return {boolean} True if is AutocompleteOption.
 */
export function isOptionObject(
	option: unknown
): option is AutocompleteOption {
	return (
		!! option &&
		typeof option === 'object' &&
		'label' in option &&
		'id' in option
	);
}

/**
 * Checks whether unknown is an AutocompleteOptionNew.
 *
 * @param {unknown} option An unknown object.
 * @return {boolean} True if is AutocompleteOptionNew.
 */
export function isNewOptionObject(
	option: unknown
): option is AutocompleteOptionNew {
	return isOptionObject( option ) && option.id === 0 && 'input' in option;
}

/**
 * Gets a label from the provided object.
 *
 * @param {unknown} option Unknown object!
 * @return {string} The label to display in the input.
 */
export function getOptionLabel( option: unknown ): string {
	if ( typeof option === 'string' ) {
		return option;
	} else if ( isNewOptionObject( option ) ) {
		return option.input;
	} else if ( isOptionObject( option ) ) {
		return option.label;
	}
	return '';
}

/**
 * Filters all potential options from the server.
 *
 * @param {AutocompleteOption[]}                     options
 * @param {FilterOptionsState< AutocompleteOption >} state
 * @return {AutocompleteOption[]} Filtered options to show user.
 */
export function filterOptions(
	options: AutocompleteOption[],
	state: FilterOptionsState< AutocompleteOption >
): AutocompleteOption[] {
	const { inputValue } = state;
	if ( ! inputValue ) {
		return [];
	}
	const filtered = options;
	if ( inputValue ) {
		// Adds a label for the option.
		filtered.push( {
			id: 0,
			input: inputValue,
			label: `Add "${ inputValue }"`,
		} );
	}
	return filtered;
}
