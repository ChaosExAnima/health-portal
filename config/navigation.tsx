import HomeIcon from '@material-ui/icons/home';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PhoneIcon from '@material-ui/icons/Phone';
import GavelIcon from '@material-ui/icons/Gavel';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

type NavigationItem = {
	href: string;
	name: string;
	icon: React.ReactNode;
};

const navigation: NavigationItem[] = [
	{
		href: '/',
		name: 'Home',
		icon: <HomeIcon />,
	},
	{
		href: '/calls',
		name: 'Calls',
		icon: <PhoneIcon />,
	},
	{
		href: '/claims',
		name: 'Claims',
		icon: <ReceiptIcon />,
	},
	{
		href: '/appeals',
		name: 'Appeals',
		icon: <GavelIcon />,
	},
	{
		href: '/providers',
		name: 'Providers',
		icon: <PermContactCalendarIcon />,
	},
];
export default navigation;
