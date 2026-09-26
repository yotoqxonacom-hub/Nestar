import React, { useId } from 'react';
import { ProductType } from '../../enums/product.enum';

/**
 * Mahsulot rasmi bo'lmaganda (demo rejim) mebelni vektor illyustratsiya sifatida chizadi.
 * `variant` — xona fonini o'zgartiradi (detail sahifadagi galereya uchun turli "burchaklar").
 */

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
export const shade = (hex: string, pct: number) => {
	const h = hex.replace('#', '');
	const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
	const r = (num >> 16) & 255,
		g = (num >> 8) & 255,
		b = num & 255;
	const t = pct < 0 ? 0 : 255;
	const p = Math.abs(pct) / 100;
	return `rgb(${clamp(r + (t - r) * p)},${clamp(g + (t - g) * p)},${clamp(b + (t - b) * p)})`;
};

const WALLS = ['#f3eee8', '#eef0ee', '#f1ede6', '#ebeef2', '#f4efe9'];
const FLOORS = ['#e2d6c7', '#dcd8cf', '#d9ccbb', '#d6d9dc', '#e0d3c2'];

interface Props {
	type: ProductType | string;
	color: string;
	variant?: number;
	className?: string;
}

const Leg = ({ x, y, h = 16 }: { x: number; y: number; h?: number }) => (
	<path d={`M${x} ${y} l3 ${h} h4 l-1 -${h} z`} fill="#6b4f3a" />
);

function Sofa({ c, seats = 3 }: { c: string; seats?: number }) {
	const w = seats === 2 ? 220 : seats >= 4 ? 300 : 260;
	const x = 200 - w / 2;
	const cw = (w - 56) / seats;
	return (
		<g>
			<Leg x={x + 18} y={226} />
			<Leg x={x + w - 26} y={226} />
			<rect x={x + 14} y={112} width={w - 28} height={80} rx={22} fill={shade(c, -12)} />
			{Array.from({ length: seats }).map((_, i) => (
				<rect key={i} x={x + 28 + i * cw + 2} y={120} width={cw - 4} height={70} rx={16} fill={shade(c, 6)} />
			))}
			<rect x={x + 14} y={186} width={w - 28} height={42} rx={12} fill={shade(c, -22)} />
			{Array.from({ length: seats }).map((_, i) => (
				<rect key={i} x={x + 28 + i * cw + 2} y={176} width={cw - 4} height={30} rx={12} fill={c} />
			))}
			<rect x={x} y={150} width={36} height={80} rx={16} fill={shade(c, -6)} />
			<rect x={x + w - 36} y={150} width={36} height={80} rx={16} fill={shade(c, -6)} />
			<rect x={x + 44} y={138} width={46} height={40} rx={12} fill="#f4f1ec" transform={`rotate(-8 ${x + 67} 158)`} />
		</g>
	);
}

function Chester({ c }: { c: string }) {
	return (
		<g>
			<Sofa c={c} seats={3} />
			{Array.from({ length: 18 }).map((_, i) => (
				<circle key={i} cx={96 + (i % 9) * 26} cy={128 + Math.floor(i / 9) * 22} r={2.2} fill={shade(c, -35)} />
			))}
		</g>
	);
}

function CornerSofa({ c }: { c: string }) {
	return (
		<g>
			<Leg x={62} y={232} />
			<Leg x={330} y={232} />
			<rect x={60} y={108} width={290} height={84} rx={22} fill={shade(c, -12)} />
			{[0, 1, 2].map((i) => (
				<rect key={i} x={76 + i * 88} y={116} width={82} height={72} rx={16} fill={shade(c, 6)} />
			))}
			<rect x={60} y={184} width={290} height={40} rx={12} fill={shade(c, -22)} />
			<rect x={74} y={172} width={180} height={30} rx={12} fill={c} />
			<rect x={236} y={172} width={120} height={66} rx={14} fill={shade(c, 4)} />
			<rect x={236} y={226} width={120} height={16} rx={8} fill={shade(c, -26)} />
			<rect x={44} y={148} width={34} height={82} rx={16} fill={shade(c, -6)} />
			<rect x={96} y={136} width={44} height={38} rx={12} fill="#f4f1ec" transform="rotate(-8 118 155)" />
			<rect x={150} y={138} width={40} height={36} rx={12} fill={shade(c, 30)} transform="rotate(6 170 156)" />
		</g>
	);
}

function Armchair({ c }: { c: string }) {
	return (
		<g>
			<Leg x={140} y={228} h={18} />
			<Leg x={250} y={228} h={18} />
			<path d="M136 196 Q136 84 200 80 Q264 84 264 196 Z" fill={shade(c, -10)} />
			<path d="M152 190 Q152 100 200 98 Q248 100 248 190 Z" fill={shade(c, 6)} />
			<rect x={128} y={184} width={144} height={46} rx={14} fill={shade(c, -22)} />
			<rect x={146} y={172} width={108} height={32} rx={12} fill={c} />
			<rect x={118} y={148} width={34} height={82} rx={16} fill={shade(c, -4)} />
			<rect x={248} y={148} width={34} height={82} rx={16} fill={shade(c, -4)} />
		</g>
	);
}

function Bed({ c }: { c: string }) {
	return (
		<g>
			<rect x={70} y={70} width={260} height={120} rx={26} fill={c} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<line key={i} x1={100 + i * 40} y1={82} x2={100 + i * 40} y2={180} stroke={shade(c, -18)} strokeWidth={3} />
			))}
			<rect x={80} y={160} width={240} height={36} rx={10} fill="#fbfaf7" />
			<rect x={96} y={142} width={92} height={36} rx={14} fill="#ffffff" stroke="#ebe6de" />
			<rect x={212} y={142} width={92} height={36} rx={14} fill="#ffffff" stroke="#ebe6de" />
			<path d="M62 196 H338 V232 Q338 240 330 240 H70 Q62 240 62 232 Z" fill={shade(c, -16)} />
			<path d="M80 184 H320 L332 214 H68 Z" fill={shade(c, 28)} />
			<rect x={68} y={206} width={264} height={10} rx={4} fill={shade(c, 12)} />
			<Leg x={74} y={238} h={10} />
			<Leg x={318} y={238} h={10} />
		</g>
	);
}

function Pouf({ c }: { c: string }) {
	return (
		<g>
			<ellipse cx={200} cy={226} rx={92} ry={20} fill={shade(c, -28)} />
			<rect x={108} y={150} width={184} height={76} fill={shade(c, -12)} />
			<ellipse cx={200} cy={150} rx={92} ry={30} fill={c} />
			{[
				[160, 146],
				[200, 138],
				[240, 146],
				[180, 158],
				[220, 158],
				[200, 150],
			].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={3} fill={shade(c, -30)} />
			))}
			<ellipse cx={320} cy={236} rx={38} ry={9} fill={shade(c, -30)} />
			<rect x={282} y={200} width={76} height={36} fill={shade(c, 0)} />
			<ellipse cx={320} cy={200} rx={38} ry={12} fill={shade(c, 18)} />
		</g>
	);
}

function Mattress({ c }: { c: string }) {
	return (
		<g>
			<path d="M80 150 L260 120 L340 150 L160 186 Z" fill="#fbfaf7" />
			<path d="M80 150 L160 186 V230 L80 196 Z" fill={shade(c, 10)} />
			<path d="M160 186 L340 150 V194 L160 230 Z" fill={shade(c, -8)} />
			<path d="M160 200 L340 164" stroke="#ffffff" strokeWidth={3} />
			<path d="M80 166 L160 200" stroke="#ffffff" strokeWidth={3} />
			{Array.from({ length: 5 }).map((_, i) => (
				<path key={i} d={`M${110 + i * 40} ${150 - i * 6} l40 17`} stroke="#ece6dc" strokeWidth={2} />
			))}
		</g>
	);
}

function Kids({ c }: { c: string }) {
	return (
		<g>
			<path d="M110 196 Q110 96 170 104 Q200 70 236 100 Q292 92 290 196 Z" fill={shade(c, -8)} />
			<rect x={104} y={180} width={192} height={50} rx={24} fill={c} />
			<circle cx={116} cy={178} r={26} fill={shade(c, -14)} />
			<circle cx={284} cy={178} r={26} fill={shade(c, -14)} />
			<circle cx={172} cy={148} r={9} fill="#ffffff" opacity={0.7} />
			<circle cx={220} cy={132} r={6} fill="#ffffff" opacity={0.7} />
			<circle cx={246} cy={156} r={7} fill="#ffffff" opacity={0.7} />
			<rect x={124} y={228} width={10} height={12} rx={4} fill="#c49a6c" />
			<rect x={266} y={228} width={10} height={12} rx={4} fill="#c49a6c" />
		</g>
	);
}

const Decor = ({ variant }: { variant: number }) => {
	if (variant % 3 === 1)
		return (
			<g>
				<line x1={352} y1={70} x2={352} y2={236} stroke="#2b2b2b" strokeWidth={2} />
				<path d="M334 70 H370 L362 46 H342 Z" fill="#e8d9c2" />
				<ellipse cx={352} cy={238} rx={14} ry={3} fill="#2b2b2b" />
			</g>
		);
	if (variant % 3 === 2)
		return (
			<g>
				<rect x={44} y={40} width={70} height={50} rx={3} fill="#ffffff" stroke="#d9d2c6" strokeWidth={3} />
				<path d="M52 82 L72 62 L86 74 L96 66 L106 82 Z" fill="#c8b79d" />
			</g>
		);
	return (
		<g>
			<path d="M42 236 h26 l-4 -30 h-18 z" fill="#c9b8a2" />
			<path d="M55 206 Q40 170 30 160 M55 206 Q56 160 66 140 M55 206 Q70 180 84 172" stroke="#6f8a5c" strokeWidth={3} fill="none" />
			<ellipse cx={34} cy={160} rx={9} ry={5} fill="#7f9a6b" />
			<ellipse cx={66} cy={140} rx={9} ry={5} fill="#7f9a6b" />
			<ellipse cx={84} cy={172} rx={9} ry={5} fill="#7f9a6b" />
		</g>
	);
};

const FurnitureArt = ({ type, color, variant = 0, className }: Props) => {
	const id = useId().replace(/:/g, '');
	const wall = WALLS[variant % WALLS.length];
	const floor = FLOORS[variant % FLOORS.length];
	let piece: React.ReactNode;
	switch (type) {
		case ProductType.CORNER_SOFA:
			piece = <CornerSofa c={color} />;
			break;
		case ProductType.ARMCHAIR:
			piece = <Armchair c={color} />;
			break;
		case ProductType.BED:
			piece = <Bed c={color} />;
			break;
		case ProductType.POUF:
			piece = <Pouf c={color} />;
			break;
		case ProductType.MATTRESS:
			piece = <Mattress c={color} />;
			break;
		case ProductType.KIDS:
			piece = <Kids c={color} />;
			break;
		case 'CHESTER':
			piece = <Chester c={color} />;
			break;
		default:
			piece = <Sofa c={color} seats={3} />;
	}
	return (
		<svg className={className} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
			<defs>
				<linearGradient id={`w${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={wall} />
					<stop offset="1" stopColor={shade(wall.replace('#', '#'), -3)} />
				</linearGradient>
			</defs>
			<rect width={400} height={300} fill={`url(#w${id})`} />
			<rect y={236} width={400} height={64} fill={floor} />
			<ellipse cx={200} cy={244} rx={170} ry={10} fill="#000" opacity={0.08} />
			<Decor variant={variant} />
			{piece}
		</svg>
	);
};

export default FurnitureArt;
