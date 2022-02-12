import MainSearchBar from './main';
import MinimizedSearchBar from './minimized';
import { SearchBarProps } from './types';

export default function SearchBar( { minimized, ...props }: SearchBarProps ) {
	if ( minimized ) {
		return <MinimizedSearchBar { ...props } />;
	}
	return <MainSearchBar { ...props } />;
}
