import Link from 'next/link';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Member } from '../../types/member';
import { products } from '../../data/mock';
import ProductImage from './ProductImage';

export const Avatar = ({ member, size = 48 }: { member?: Partial<Member>; size?: number }) => {
	const name = member?.memberFullName || member?.memberNick || '?';
	const initials = name
		.split(' ')
		.map((w) => w[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
	const hue = [...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 360;
	return (
		<span
			className="avatar"
			style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${hue} 32% 88%)`, color: `hsl(${hue} 35% 30%)` }}
		>
			{initials}
		</span>
	);
};

const AgentCard = ({ agent }: { agent: Member }) => {
	const cover = products.find((p) => p.memberId === agent._id);
	return (
		<Link href={`/agent/detail?id=${agent._id}`} className="agent-card">
			<div className="cover">{cover && <ProductImage product={cover} index={1} />}</div>
			<div className="body">
				<Avatar member={agent} size={56} />
				<strong>{agent.memberFullName}</strong>
				<span className="addr">
					<PlaceOutlinedIcon /> {agent.memberAddress}
				</span>
				<div className="nums">
					<span>
						<b>{agent.memberProducts}</b> products
					</span>
					<span>
						<b>{agent.memberFollowers.toLocaleString('ru-RU')}</b> followers
					</span>
				</div>
				<span className="visit">
					<StorefrontOutlinedIcon /> View agent
				</span>
			</div>
		</Link>
	);
};

export default AgentCard;
