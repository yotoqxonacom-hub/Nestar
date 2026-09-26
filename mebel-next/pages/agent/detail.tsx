import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductCard from '../../libs/components/common/ProductCard';
import { Avatar } from '../../libs/components/common/AgentCard';
import { findAgent, products } from '../../libs/data/mock';
import { formatDate } from '../../libs/utils';

/** Nestar: agent/detail — sotuvchi profili va uning mahsulotlari (Follow bilan) */
const AgentDetail: NextPage = () => {
	const router = useRouter();
	const agent = findAgent(router.query.id);
	const [following, setFollowing] = useState(false);

	if (!agent) {
		return (
			<div className="agent-detail-page container empty-list">
				<strong>{router.isReady ? 'Sotuvchi topilmadi' : 'Yuklanmoqda…'}</strong>
				<Link href="/agent" className="btn-dark">
					Sotuvchilar ro'yxati
				</Link>
			</div>
		);
	}

	const list = products.filter((p) => p.memberId === agent._id);

	return (
		<div className="agent-detail-page">
			<div className="container col">
				<div className="agent-hero">
					<Avatar member={agent} size={96} />
					<div className="txt">
						<h2>{agent.memberFullName}</h2>
						<span>
							<PlaceOutlinedIcon /> {agent.memberAddress}
						</span>
						<p>{agent.memberDesc}</p>
					</div>
					<div className="nums">
						<div>
							<b>{agent.memberProducts}</b>
							<span>mahsulot</span>
						</div>
						<div>
							<b>{(agent.memberFollowers + (following ? 1 : 0)).toLocaleString('ru-RU')}</b>
							<span>obunachi</span>
						</div>
						<div>
							<b>{agent.memberViews.toLocaleString('ru-RU')}</b>
							<span>ko'rishlar</span>
						</div>
					</div>
					<div className="btns">
						<button className={following ? 'btn-outline' : 'btn-dark'} onClick={() => setFollowing(!following)}>
							{following ? 'Obuna bo‘lingan' : 'Obuna bo‘lish'}
						</button>
						<a className="btn-outline" href={`tel:${agent.memberPhone.replace(/\s/g, '')}`}>
							<PhoneOutlinedIcon /> {agent.memberPhone}
						</a>
					</div>
				</div>

				<div className="agent-products">
					<h3>
						Mahsulotlar <small>({list.length})</small>
					</h3>
					<div className="product-grid">
						{list.map((p) => (
							<ProductCard key={p._id} product={p} />
						))}
					</div>
					<p className="since">Platformada {formatDate(agent.createdAt)} dan beri</p>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(AgentDetail);
