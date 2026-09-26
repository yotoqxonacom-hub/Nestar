import React, { useState } from 'react';
import { NextPage } from 'next';
import SearchIcon from '@mui/icons-material/Search';
import withAdminLayout, { ADMIN_MENU } from '../../libs/components/layout/LayoutAdmin';
import ProductImage from '../../libs/components/common/ProductImage';
import { Avatar } from '../../libs/components/common/AgentCard';
import { allMembers, articles, demoOrders, notices, products } from '../../libs/data/mock';
import { MemberStatus } from '../../libs/enums/member.enum';
import { ProductStatus } from '../../libs/enums/product.enum';
import { OrderStatus } from '../../libs/enums/order.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { categoryLabel, finalPrice, formatDate, formatSum, orderStatusLabel, paymentLabel, typeLabel } from '../../libs/utils';

const StatusSelect = <T extends string>({ value, options, onChange, id }: { value: T; options: T[]; onChange: (v: T) => void; id: string }) => (
	<select id={id} className={`status-select status-chip ${value}`} value={value} onChange={(e) => onChange(e.target.value as T)}>
		{options.map((o) => (
			<option key={o} value={o}>
				{o}
			</option>
		))}
	</select>
);

const Dashboard = () => {
	const revenue = demoOrders.filter((o) => o.orderStatus !== OrderStatus.CANCEL).reduce((s, o) => s + o.orderTotal, 0);
	const byType = Object.entries(
		products.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.productType]: (acc[p.productType] ?? 0) + p.productViews }), {}),
	).sort((a, b) => b[1] - a[1]);
	const max = byType[0]?.[1] ?? 1;
	return (
		<>
			<div className="kpis">
				<div className="kpi">
					<span>Tushum (sentabr)</span>
					<b className="tabular">{formatSum(revenue)}</b>
					<small className="up">+12% avgustga nisbatan</small>
				</div>
				<div className="kpi">
					<span>Buyurtmalar</span>
					<b className="tabular">{demoOrders.length + 41}</b>
					<small>3 tasi kutilmoqda</small>
				</div>
				<div className="kpi">
					<span>Faol mahsulotlar</span>
					<b className="tabular">{products.filter((p) => p.productStatus === ProductStatus.ACTIVE).length}</b>
					<small>1 tasi omborda qolmagan</small>
				</div>
				<div className="kpi">
					<span>Foydalanuvchilar</span>
					<b className="tabular">{allMembers.length}</b>
					<small>{allMembers.filter((m) => m.memberType === 'AGENT').length} sotuvchi</small>
				</div>
			</div>
			<div className="panel">
				<h3>Kategoriyalar bo'yicha ko'rishlar</h3>
				<div className="bars">
					{byType.map(([t, v]) => (
						<div className="bar-row" key={t}>
							<span>{typeLabel[t as keyof typeof typeLabel]}</span>
							<div className="bar">
								<i style={{ width: `${(v / max) * 100}%` }} />
							</div>
							<b className="tabular">{v.toLocaleString('ru-RU')}</b>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

const AdminPage: NextPage<{ category?: string }> = ({ category = 'dashboard' }) => {
	const [q, setQ] = useState('');
	const [members, setMembers] = useState(allMembers);
	const [items, setItems] = useState(products);
	const [orders, setOrders] = useState(demoOrders);
	const [posts, setPosts] = useState(articles);
	const [cs, setCs] = useState(notices);
	const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());

	return (
		<div className="admin-page">
			<div className="admin-head">
				<h1>{ADMIN_MENU.find((m) => m.key === category)?.label}</h1>
				{category !== 'dashboard' && (
					<label className="search">
						<SearchIcon />
						<input id="admin-search" placeholder="Qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
					</label>
				)}
			</div>

			{category === 'dashboard' && <Dashboard />}

			{category === 'users' && (
				<div className="table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Foydalanuvchi</th>
								<th>Telefon</th>
								<th>Turi</th>
								<th>Mahsulot / Maqola</th>
								<th>Holati</th>
							</tr>
						</thead>
						<tbody>
							{members
								.filter((m) => match(`${m.memberNick} ${m.memberFullName}`))
								.map((m) => (
									<tr key={m._id}>
										<td className="who">
											<Avatar member={m} size={34} />
											<div>
												<b>{m.memberFullName}</b>
												<span>@{m.memberNick}</span>
											</div>
										</td>
										<td className="tabular">{m.memberPhone}</td>
										<td>{m.memberType}</td>
										<td className="tabular">
											{m.memberProducts} / {m.memberArticles}
										</td>
										<td>
											<StatusSelect
												id={`ms-${m._id}`}
												value={m.memberStatus}
												options={[MemberStatus.ACTIVE, MemberStatus.BLOCK, MemberStatus.DELETE]}
												onChange={(v) => setMembers(members.map((x) => (x._id === m._id ? { ...x, memberStatus: v } : x)))}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}

			{category === 'products' && (
				<div className="table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Mahsulot</th>
								<th>Turi</th>
								<th>Narx</th>
								<th>Qoldiq</th>
								<th>Sotuvchi</th>
								<th>Holati</th>
							</tr>
						</thead>
						<tbody>
							{items
								.filter((p) => match(p.productName))
								.map((p) => (
									<tr key={p._id}>
										<td className="who">
											<span className="thumb">
												<ProductImage product={p} />
											</span>
											<b>{p.productName}</b>
										</td>
										<td>{typeLabel[p.productType]}</td>
										<td className="tabular">{formatSum(finalPrice(p))}</td>
										<td className="tabular">{p.productLeftCount}</td>
										<td>{p.memberData?.memberFullName}</td>
										<td>
											<StatusSelect
												id={`ps-${p._id}`}
												value={p.productStatus}
												options={[ProductStatus.ACTIVE, ProductStatus.SOLD, ProductStatus.DELETE]}
												onChange={(v) => setItems(items.map((x) => (x._id === p._id ? { ...x, productStatus: v } : x)))}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}

			{category === 'orders' && (
				<div className="table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>№</th>
								<th>Sana</th>
								<th>Mahsulotlar</th>
								<th>To'lov</th>
								<th>Summa</th>
								<th>Holati</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((o) => (
								<tr key={o._id}>
									<td className="tabular">#{o._id.replace('o', '')}</td>
									<td>{formatDate(o.createdAt)}</td>
									<td>{o.productData.map((p) => p.productName).join(', ')}</td>
									<td>{paymentLabel[o.paymentType]}</td>
									<td className="tabular">{formatSum(o.orderTotal + o.orderDelivery)}</td>
									<td>
										<StatusSelect
											id={`os-${o._id}`}
											value={o.orderStatus}
											options={Object.values(OrderStatus)}
											onChange={(v) => setOrders(orders.map((x) => (x._id === o._id ? { ...x, orderStatus: v } : x)))}
										/>
										<small className="hint">{orderStatusLabel[o.orderStatus]}</small>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{category === 'community' && (
				<div className="table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Sarlavha</th>
								<th>Bo'lim</th>
								<th>Muallif</th>
								<th>Ko'rish / Like</th>
								<th>Holati</th>
							</tr>
						</thead>
						<tbody>
							{posts
								.filter((a) => match(a.articleTitle))
								.map((a) => (
									<tr key={a._id}>
										<td>
											<b>{a.articleTitle}</b>
										</td>
										<td>{categoryLabel[a.articleCategory]}</td>
										<td>{a.memberData?.memberFullName}</td>
										<td className="tabular">
											{a.articleViews} / {a.articleLikes}
										</td>
										<td>
											<StatusSelect
												id={`as-${a._id}`}
												value={a.articleStatus}
												options={[BoardArticleStatus.ACTIVE, BoardArticleStatus.DELETE]}
												onChange={(v) => setPosts(posts.map((x) => (x._id === a._id ? { ...x, articleStatus: v } : x)))}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}

			{category === 'cs' && (
				<div className="table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Sarlavha</th>
								<th>Turi</th>
								<th>Sana</th>
								<th>Holati</th>
							</tr>
						</thead>
						<tbody>
							{cs
								.filter((n) => match(n.noticeTitle))
								.map((n) => (
									<tr key={n._id}>
										<td>
											<b>{n.noticeTitle}</b>
										</td>
										<td>{n.noticeCategory}</td>
										<td>{formatDate(n.createdAt)}</td>
										<td>
											<StatusSelect
												id={`ns-${n._id}`}
												value={n.noticeStatus}
												options={[NoticeStatus.HOLD, NoticeStatus.ACTIVE, NoticeStatus.DELETE]}
												onChange={(v) => setCs(cs.map((x) => (x._id === n._id ? { ...x, noticeStatus: v } : x)))}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default withAdminLayout(AdminPage);
