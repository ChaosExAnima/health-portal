import HomeIcon from '@material-ui/icons/home';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PhoneIcon from '@material-ui/icons/Phone';
import GavelIcon from '@material-ui/icons/Gavel';

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
		href: '/appeals',
		name: 'Appeals',
		icon: <GavelIcon />,
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
];
export default navigation;
