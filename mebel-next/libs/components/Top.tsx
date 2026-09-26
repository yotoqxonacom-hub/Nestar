import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Badge, Drawer, IconButton, Menu, MenuItem } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useCart, useLikes } from '../hooks/useStore';
import { userVar } from '../../apollo/store';
import { logOut } from '../auth';
import { SUPPORT_PHONE } from '../config';
import Logo from './common/Logo';
import { Avatar } from './common/AgentCard';

const NAV = [
	{ href: '/', label: 'Bosh sahifa' },
	{ href: '/product', label: 'Katalog' },
	{ href: '/agent', label: 'Sotuvchilar' },
	{ href: '/community?articleCategory=FREE', label: 'Hamjamiyat' },
	{ href: '/cs', label: 'Yordam' },
];

const isActive = (pathname: string, href: string) => {
	const base = href.split('?')[0];
	return base === '/' ? pathname === '/' : pathname.startsWith(base);
};

const Top = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { count } = useCart();
	const { liked } = useLikes();
	const [scrolled, setScrolled] = useState(false);
	const [drawer, setDrawer] = useState(false);
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => setDrawer(false), [router.asPath]);

	const nav = user?._id ? [...NAV.slice(0, 4), { href: '/mypage', label: 'Mening sahifam' }, NAV[4]] : NAV;

	if (device === 'mobile') {
		return (
			<>
				<header className="m-header">
					<IconButton aria-label="Menyu" onClick={() => setDrawer(true)}>
						<MenuIcon />
					</IconButton>
					<Logo />
					<Link href="/cart" className="icon-link" aria-label="Savat">
						<Badge badgeContent={count} color="primary">
							<ShoppingBagOutlinedIcon />
						</Badge>
					</Link>
				</header>

				<Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)} PaperProps={{ className: 'm-drawer' }}>
					<div className="m-drawer-head">
						<Logo />
						<IconButton aria-label="Yopish" onClick={() => setDrawer(false)}>
							<CloseIcon />
						</IconButton>
					</div>
					{user?._id ? (
						<Link href="/mypage" className="m-drawer-user">
							<Avatar member={user} size={44} />
							<span>
								<b>{user.memberFullName || user.memberNick}</b>
								<small>{user.memberPhone}</small>
							</span>
						</Link>
					) : (
						<Link href="/account/join" className="m-drawer-login">
							<AccountCircleOutlinedIcon /> Kirish / Ro'yxatdan o'tish
						</Link>
					)}
					<nav>
						{nav.map((n) => (
							<Link key={n.href} href={n.href} className={isActive(router.pathname, n.href) ? 'active' : ''}>
								{n.label}
							</Link>
						))}
						<Link href="/about">Biz haqimizda</Link>
						{user?.memberType === 'ADMIN' && <Link href="/_admin">Admin panel</Link>}
					</nav>
					<div className="m-drawer-foot">
						<span>Qo'ng'iroq markazi</span>
						<b>{SUPPORT_PHONE}</b>
						{user?._id && (
							<button onClick={logOut}>
								<LogoutIcon /> Chiqish
							</button>
						)}
					</div>
				</Drawer>

				<nav className="m-tabbar" aria-label="Asosiy">
					<Link href="/" className={router.pathname === '/' ? 'active' : ''}>
						<HomeOutlinedIcon />
						<span>Asosiy</span>
					</Link>
					<Link href="/product" className={router.pathname.startsWith('/product') ? 'active' : ''}>
						<WeekendOutlinedIcon />
						<span>Katalog</span>
					</Link>
					<Link href="/cart" className={router.pathname === '/cart' ? 'active' : ''}>
						<Badge badgeContent={count} color="primary">
							<ShoppingBagOutlinedIcon />
						</Badge>
						<span>Savat</span>
					</Link>
					<Link href="/mypage?category=favorites" className={router.asPath.includes('favorites') ? 'active' : ''}>
						<Badge badgeContent={liked.length} color="primary">
							<FavoriteBorderIcon />
						</Badge>
						<span>Sevimli</span>
					</Link>
					<Link
						href={user?._id ? '/mypage' : '/account/join'}
						className={router.pathname === '/mypage' && !router.asPath.includes('favorites') ? 'active' : ''}
					>
						<PersonOutlineIcon />
						<span>Profil</span>
					</Link>
				</nav>
			</>
		);
	}

	return (
		<div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
			<div className="container">
				<Logo light />
				<nav className="router-box">
					{nav.map((n) => (
						<Link key={n.href} href={n.href} className={isActive(router.pathname, n.href) ? 'active' : ''}>
							{n.label}
						</Link>
					))}
				</nav>
				<div className="user-box">
					<Link href="/mypage?category=favorites" className="icon-link" aria-label="Sevimlilar">
						<Badge badgeContent={liked.length} color="primary">
							<FavoriteBorderIcon />
						</Badge>
					</Link>
					<Link href="/cart" className="icon-link" aria-label="Savat">
						<Badge badgeContent={count} color="primary">
							<ShoppingBagOutlinedIcon />
						</Badge>
					</Link>
					{user?._id ? (
						<>
							<IconButton className="icon-link" aria-label="Bildirishnomalar">
								<Badge variant="dot" color="primary">
									<NotificationsOutlinedIcon />
								</Badge>
							</IconButton>
							<button className="login-user" onClick={(e) => setAnchor(e.currentTarget)} aria-label="Profil menyusi">
								<Avatar member={user} size={40} />
							</button>
							<Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} sx={{ mt: 1 }}>
								<MenuItem onClick={() => router.push('/mypage')}>
									<PersonOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Mening sahifam
								</MenuItem>
								{user.memberType === 'ADMIN' && (
									<MenuItem onClick={() => router.push('/_admin')}>
										<AdminPanelSettingsOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} /> Admin panel
									</MenuItem>
								)}
								<MenuItem onClick={logOut}>
									<LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Chiqish
								</MenuItem>
							</Menu>
						</>
					) : (
						<Link href="/account/join" className="join-box">
							<AccountCircleOutlinedIcon />
							<span>Kirish / Ro'yxatdan o'tish</span>
						</Link>
					)}
					<span className="lang">UZ</span>
				</div>
			</div>
		</div>
	);
};

export default Top;
