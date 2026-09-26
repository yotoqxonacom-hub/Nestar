import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductCard from '../../libs/components/common/ProductCard';
import ProductImage from '../../libs/components/common/ProductImage';
import ArticleCard from '../../libs/components/common/ArticleCard';
import AgentCard, { Avatar } from '../../libs/components/common/AgentCard';
import { agents, articles, demoOrders, findProduct, myReports } from '../../libs/data/mock';
import { recentVar, userVar } from '../../apollo/store';
import { useLikes, saveSession } from '../../libs/hooks/useStore';
import { logOut } from '../../libs/auth';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Order } from '../../libs/types/order';
import { formatDate, formatSum, orderStatusLabel, paymentLabel, reportGroupLabel, reportReasonLabel, reportStatusLabel } from '../../libs/utils';

const MENU = [
	{ key: 'orders', label: 'My Orders', icon: <ReceiptLongOutlinedIcon /> },
	{ key: 'favorites', label: 'My Favorites', icon: <FavoriteBorderIcon /> },
	{ key: 'recent', label: 'Recently Visited', icon: <HistoryIcon /> },
	{ key: 'articles', label: 'My Articles', icon: <ArticleOutlinedIcon /> },
	{ key: 'followings', label: 'My Followings', icon: <StorefrontOutlinedIcon /> },
	{ key: 'reports', label: 'My Reports', icon: <OutlinedFlagIcon /> },
	{ key: 'profile', label: 'My Profile', icon: <PersonOutlineIcon /> },
];

const STEPS = [OrderStatus.PAUSE, OrderStatus.PROCESS, OrderStatus.DELIVERY, OrderStatus.FINISH];

const OrderCard = ({ order, onCancel }: { order: Order; onCancel: () => void }) => {
	const step = STEPS.indexOf(order.orderStatus);
	return (
		<div className="order-card">
			<div className="order-head">
				<div>
					<b>Order #{order._id.replace('o', '')}</b>
					<span>
						{formatDate(order.createdAt)} · {paymentLabel[order.paymentType]}
					</span>
				</div>
				<span className={`status-chip ${order.orderStatus}`}>{orderStatusLabel[order.orderStatus]}</span>
			</div>
			{step >= 0 && (
				<ol className="order-steps">
					{STEPS.map((s, i) => (
						<li key={s} className={i <= step ? 'done' : ''}>
							<i />
							<span>{orderStatusLabel[s]}</span>
						</li>
					))}
				</ol>
			)}
			<div className="order-items">
				{order.orderItems.map((it) => {
					const p = findProduct(it.productId);
					if (!p) return null;
					return (
						<Link key={it._id} href={`/product/detail?id=${p._id}`} className="order-item">
							<ProductImage product={p} />
							<div>
								<b>{p.productName}</b>
								<span className="tabular">
									{it.itemQuantity} × {formatSum(it.itemPrice)}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
			<div className="order-foot">
				<span>
					Total: <b className="tabular">{formatSum(order.orderTotal + order.orderDelivery)}</b>
				</span>
				{order.orderStatus === OrderStatus.PAUSE && (
					<button className="btn-outline" onClick={onCancel}>
						Cancel order
					</button>
				)}
			</div>
		</div>
	);
};

/** Nestar: mypage — foydalanuvchi kabineti */
const MyPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const recent = useReactiveVar(recentVar);
	const { liked } = useLikes();
	const category = (router.query.category as string) || 'orders';
	const [orders, setOrders] = useState<Order[]>(() => [
		{ ...demoOrders[0], _id: 'o1031', orderStatus: OrderStatus.PAUSE, createdAt: new Date(Date.UTC(2026, 8, 25)).toISOString() },
		...demoOrders,
	]);
	const [form, setForm] = useState({ memberFullName: '', memberPhone: '', memberAddress: '' });
	const [savedMsg, setSavedMsg] = useState(false);

	// keep the active tab visible in the horizontally scrolling mobile menu
	useEffect(() => {
		document.querySelector('.my-menu nav button.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
	}, [category]);

	if (!user?._id) {
		return (
			<div className="mypage">
				<div className="container col">
					<div className="empty-list">
						<PersonOutlineIcon />
						<strong>Log in to see your page</strong>
						<Link href="/account/join" className="btn-accent">
							Login
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const go = (key: string) => router.push(`/mypage?category=${key}`, undefined, { shallow: true });
	const favorites = liked.map((id) => findProduct(id)).filter(Boolean);
	const visited = recent.map((id) => findProduct(id)).filter(Boolean);
	const myArticles = articles.filter((a) => a.memberId === 'u1' || a.memberId === 'u3').slice(0, 2);

	return (
		<div className="mypage">
			<div className="container">
				<aside className="my-menu">
					<div className="profile">
						<Avatar member={user} size={72} />
						<b>{user.memberFullName || user.memberNick}</b>
						<span>{user.memberPhone}</span>
						<span className="type">{user.memberType === 'AGENT' ? 'Agent' : user.memberType === 'ADMIN' ? 'Admin' : 'Member'}</span>
					</div>
					<nav>
						{MENU.map((m) => (
							<button key={m.key} className={category === m.key ? 'active' : ''} onClick={() => go(m.key)}>
								{m.icon}
								<span>{m.label}</span>
								{m.key === 'favorites' && <em>{liked.length}</em>}
								{m.key === 'orders' && <em>{orders.length}</em>}
								{m.key === 'reports' && <em>{myReports.length}</em>}
							</button>
						))}
						<button onClick={logOut}>
							<LogoutIcon />
							<span>Logout</span>
						</button>
					</nav>
				</aside>

				<section className="my-content">
					<h2>{MENU.find((m) => m.key === category)?.label}</h2>

					{category === 'orders' && (
						<div className="order-list">
							{orders.map((o) => (
								<OrderCard
									key={o._id}
									order={o}
									onCancel={() => setOrders(orders.map((x) => (x._id === o._id ? { ...x, orderStatus: OrderStatus.CANCEL } : x)))}
								/>
							))}
						</div>
					)}

					{category === 'favorites' &&
						(favorites.length ? (
							<div className="product-grid">
								{favorites.map((p) => (
									<ProductCard key={p!._id} product={p!} />
								))}
							</div>
						) : (
							<div className="empty-list">
								<FavoriteBorderIcon />
								<strong>No favorites yet</strong>
								<span>Tap the heart on any furniture card.</span>
							</div>
						))}

					{category === 'recent' &&
						(visited.length ? (
							<div className="product-grid">
								{visited.map((p) => (
									<ProductCard key={p!._id} product={p!} />
								))}
							</div>
						) : (
							<div className="empty-list">
								<HistoryIcon />
								<strong>Nothing viewed yet</strong>
							</div>
						))}

					{category === 'articles' && (
						<>
							<Link href="/community?write=1" className="btn-dark write-btn">
								Write an article
							</Link>
							<div className="article-grid">
								{myArticles.map((a) => (
									<ArticleCard key={a._id} article={a} />
								))}
							</div>
						</>
					)}

					{category === 'followings' && (
						<div className="agent-grid">
							{agents.slice(0, 4).map((a) => (
								<AgentCard key={a._id} agent={a} />
							))}
						</div>
					)}

					{category === 'reports' && (
						<div className="report-list">
							<p className="report-note">Reports are private — only you and the admins can see them. A resolved report adds a warning to the agent.</p>
							{myReports.map((r) => (
								<div className="report-card" key={r._id}>
									<div className="rc-head">
										<div>
											<span className="rc-group">{reportGroupLabel[r.reportGroup]}</span>
											<b>{r.targetName}</b>
										</div>
										<span className={`status-chip ${r.reportStatus}`}>{reportStatusLabel[r.reportStatus]}</span>
									</div>
									<div className="rc-reason">
										<OutlinedFlagIcon /> {reportReasonLabel[r.reportReason]}
									</div>
									{r.reportDesc && <p>{r.reportDesc}</p>}
									<span className="rc-date">Sent {formatDate(r.createdAt)}</span>
								</div>
							))}
						</div>
					)}

					{category === 'profile' && (
						<form
							className="profile-form"
							onSubmit={(e) => {
								e.preventDefault();
								const next = {
									...user,
									memberFullName: form.memberFullName || user.memberFullName,
									memberPhone: form.memberPhone || user.memberPhone,
									memberAddress: form.memberAddress || user.memberAddress,
								};
								saveSession(next, (user.accessToken as string) || 'demo-token');
								setSavedMsg(true);
							}}
						>
							<div className="form-field">
								<label htmlFor="pf-name">Full name</label>
								<input id="pf-name" placeholder={user.memberFullName} value={form.memberFullName} onChange={(e) => setForm({ ...form, memberFullName: e.target.value })} />
							</div>
							<div className="form-field">
								<label htmlFor="pf-phone">Phone</label>
								<input id="pf-phone" placeholder={user.memberPhone} value={form.memberPhone} onChange={(e) => setForm({ ...form, memberPhone: e.target.value })} />
							</div>
							<div className="form-field wide">
								<label htmlFor="pf-address">Address</label>
								<input
									id="pf-address"
									placeholder={user.memberAddress || 'City, district, street, building'}
									value={form.memberAddress}
									onChange={(e) => setForm({ ...form, memberAddress: e.target.value })}
								/>
							</div>
							<div className="wide actions">
								<button type="submit" className="btn-dark">
									Save changes
								</button>
								{savedMsg && <span className="ok">Profile updated</span>}
							</div>
						</form>
					)}
				</section>
			</div>
		</div>
	);
};

export default withLayoutBasic(MyPage);
