import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PhoneIcon from '@mui/icons-material/Phone';
import GavelIcon from '@mui/icons-material/Gavel';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

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
