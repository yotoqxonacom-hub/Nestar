import Link from 'next/link';
import NorthEastIcon from '@mui/icons-material/NorthEast';

interface Props {
	title: string;
	desc?: string;
	more?: { href: string; label: string };
	light?: boolean;
	center?: boolean;
}

const SectionHead = ({ title, desc, more, light, center }: Props) => (
	<div className={`section-head ${light ? 'light' : ''} ${center ? 'center' : ''}`}>
		<div className="left">
			<h2>{title}</h2>
			{desc && <p>{desc}</p>}
		</div>
		{more && (
			<Link href={more.href} className="more">
				{more.label} <NorthEastIcon />
			</Link>
		)}
	</div>
);

export default SectionHead;
