import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHydrateStore } from '../../hooks/useStore';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';
import Logo from '../common/Logo';
import { Avatar } from '../common/AgentCard';

export const ADMIN_MENU = [
	{ key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
	{ key: 'users', label: 'Users', icon: <PeopleOutlineIcon /> },
	{ key: 'products', label: 'Furniture', icon: <WeekendOutlinedIcon /> },
	{ key: 'orders', label: 'Orders', icon: <ReceiptLongOutlinedIcon /> },
	{ key: 'community', label: 'Community', icon: <ForumOutlinedIcon /> },
	{ key: 'reports', label: 'Reports', icon: <OutlinedFlagIcon /> },
	{ key: 'cs', label: 'CS', icon: <SupportAgentOutlinedIcon /> },
];

/** Nestar: LayoutAdmin — faqat MemberType.ADMIN uchun */
const withAdminLayout = (Component: any) => {
	const Wrapped = (props: any) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		useHydrateStore();
		const category = (router.query.category as string) || 'dashboard';

		return (
			<>
				<Head>
					<title>Admin — Nestar Furniture</title>
				</Head>
				<div id="admin-wrap">
					<aside className="admin-side">
						<Logo light />
						<nav>
							{ADMIN_MENU.map((m) => (
								<Link key={m.key} href={`/_admin?category=${m.key}`} shallow className={category === m.key ? 'active' : ''}>
									{m.icon}
									{m.label}
								</Link>
							))}
						</nav>
						<div className="admin-user">
							<Avatar member={user} size={36} />
							<span>{user.memberFullName || user.memberNick || 'Admin'}</span>
							<button onClick={logOut} aria-label="Logout">
								<LogoutIcon />
							</button>
						</div>
					</aside>
					<main className="admin-main">
						{user?.memberType === 'ADMIN' ? (
							<Component {...props} category={category} />
						) : (
							<div className="empty-list">
								<strong>Admins only</strong>
								<span>Log in with an ADMIN account.</span>
								<Link href="/account/join" className="btn-dark">
									Login
								</Link>
							</div>
						)}
					</main>
				</div>
			</>
		);
	};
	return Wrapped;
};

export default withAdminLayout;
