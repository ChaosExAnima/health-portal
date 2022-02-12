export type SearchBarProps = {
	minimized?: boolean;
	inputId?: string;
	options: SearchOption[];
};

export type SearchOption = {
	title: string;
	href: string;
	type?: string;
};
