import { Control } from 'react-hook-form';

type AutocompleteProps = {
	name: string;
	label: string;
	control: Control< any >;
	target?: string;
	multiple?: boolean;
	required?: boolean;
	free?: boolean;
};

type AutocompleteOptionDB = {
	id: number;
	label: string;
};
type AutocompleteOptionNew = {
	id: 0;
	label: string;
	input: string;
};
type AutocompleteOption = AutocompleteOptionDB | AutocompleteOptionNew;
type AutocompleteResponseError = {
	success: false;
	errors: string[];
};
type AutocompleteResponseSuccess = {
	success: true;
	options: AutocompleteOption[];
};
type AutocompleteResponse = AutocompleteResponseError | AutocompleteResponseSuccess;
