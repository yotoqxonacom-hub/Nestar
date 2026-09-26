import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import SearchIcon from '@mui/icons-material/Search';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import AgentCard from '../../libs/components/common/AgentCard';
import { agents } from '../../libs/data/mock';

const SORTS = {
	memberRank: 'Reyting',
	memberFollowers: 'Obunachilar',
	memberProducts: 'Mahsulotlar soni',
} as const;

/** Nestar: agent/index — sotuvchilar (MemberType.AGENT) ro'yxati */
const AgentList: NextPage = () => {
	const [text, setText] = useState('');
	const [sort, setSort] = useState<keyof typeof SORTS>('memberRank');

	const list = useMemo(
		() =>
			agents
				.filter((a) => `${a.memberFullName} ${a.memberAddress}`.toLowerCase().includes(text.toLowerCase()))
				.sort((a, b) => b[sort] - a[sort]),
		[text, sort],
	);

	return (
		<div className="agent-list-page">
			<div className="container col">
				<div className="filter">
					<label className="search">
						<SearchIcon />
						<input id="agent-search" placeholder="Sotuvchi nomi yoki shahar" value={text} onChange={(e) => setText(e.target.value)} />
					</label>
					<label className="sort">
						<span>Saralash:</span>
						<select id="agent-sort" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}>
							{Object.entries(SORTS).map(([k, v]) => (
								<option key={k} value={k}>
									{v}
								</option>
							))}
						</select>
					</label>
				</div>
				{list.length === 0 ? (
					<div className="empty-list">
						<strong>Sotuvchi topilmadi</strong>
					</div>
				) : (
					<div className="agent-grid">
						{list.map((a) => (
							<AgentCard key={a._id} agent={a} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutBasic(AgentList);
