import React, { useState } from 'react';
import Link from 'next/link';
import EastIcon from '@mui/icons-material/East';
import { ProductType } from '../../enums/product.enum';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { agents, articles, products } from '../../data/mock';
import { typeLabel } from '../../utils';
import { topProductRank } from '../../config';
import SectionHead from '../common/SectionHead';
import ProductCard from '../common/ProductCard';
import Carousel from '../common/Carousel';
import AgentCard from '../common/AgentCard';
import ArticleCard from '../common/ArticleCard';
import FurnitureArt from '../common/FurnitureArt';

const CATEGORY_COLORS: Record<ProductType, string> = {
	[ProductType.SOFA]: '#7b8f74',
	[ProductType.CORNER_SOFA]: '#8a8f99',
	[ProductType.ARMCHAIR]: '#c9a27a',
	[ProductType.BED]: '#5b6b8c',
	[ProductType.POUF]: '#d98b7e',
	[ProductType.MATTRESS]: '#9fb6c9',
	[ProductType.KIDS]: '#e6b85c',
};

export const Categories = () => (
	<section className="categories">
		<div className="container col">
			<SectionHead title="Kategoriyalar" desc="Xonangiz uchun kerakli turini tanlang" />
			<div className="category-grid">
				{Object.values(ProductType).map((t) => (
					<Link key={t} href={`/product?type=${t}`} className="category">
						<FurnitureArt type={t} color={CATEGORY_COLORS[t]} variant={3} />
						<span>{typeLabel[t]}</span>
						<small>{products.filter((p) => p.productType === t).length} ta model</small>
					</Link>
				))}
			</div>
		</div>
	</section>
);

/** Nestar: TrendProperties — like'lar bo'yicha */
export const TrendProducts = () => {
	const list = [...products].sort((a, b) => b.productLikes - a.productLikes).slice(0, 8);
	return (
		<section className="trend-products">
			<div className="container col">
				<SectionHead title="Trenddagi mebellar" desc="Xaridorlar eng ko'p yoqtirganlar" />
				<Carousel>
					{list.map((p) => (
						<ProductCard key={p._id} product={p} />
					))}
				</Carousel>
			</div>
		</section>
	);
};

/** Nestar: PopularProperties — ko'rishlar bo'yicha */
export const PopularProducts = () => {
	const list = [...products].sort((a, b) => b.productViews - a.productViews).slice(0, 4);
	return (
		<section className="popular-products">
			<div className="container col">
				<SectionHead title="Ommabop" desc="Eng ko'p ko'rilgan modellar" more={{ href: '/product?sort=productViews', label: 'Barchasini ko‘rish' }} />
				<div className="popular-grid">
					{list.map((p, i) => (
						<ProductCard key={p._id} product={p} size={i === 0 ? 'wide' : 'normal'} />
					))}
				</div>
			</div>
		</section>
	);
};

export const Advertisement = () => (
	<section className="advertisement">
		<div className="container ad-inner">
			<div className="ad-copy">
				<span className="eyebrow">1 – 31 oktabr</span>
				<h2>Burchak divanlarga 15% gacha chegirma</h2>
				<p>Toshkent bo'ylab bepul yetkazib berish va yig'ib berish. Chegirma bo'lib to'lashda ham amal qiladi.</p>
				<Link href={`/product?type=${ProductType.CORNER_SOFA}`} className="btn-accent">
					Kolleksiyani ko'rish <EastIcon />
				</Link>
			</div>
			<div className="ad-art">
				<FurnitureArt type={ProductType.CORNER_SOFA} color="#8a8f99" variant={1} />
				<span className="ad-tag">-15%</span>
			</div>
		</div>
	</section>
);

/** Nestar: TopProperties — reyting bo'yicha */
export const TopProducts = () => {
	const list = products.filter((p) => p.productRank >= topProductRank).sort((a, b) => b.productRank - a.productRank);
	return (
		<section className="top-products">
			<div className="container col">
				<SectionHead title="Eng yuqori reyting" desc="Sifat va sharhlar bo'yicha tanlanganlar" />
				<Carousel>
					{list.map((p) => (
						<ProductCard key={p._id} product={p} />
					))}
				</Carousel>
			</div>
		</section>
	);
};

export const TopAgents = () => (
	<section className="top-agents">
		<div className="container col">
			<SectionHead title="Top sotuvchilar" desc="Ishonchli shourum va ishlab chiqaruvchilar" more={{ href: '/agent', label: 'Barcha sotuvchilar' }} />
			<Carousel>
				{agents.map((a) => (
					<AgentCard key={a._id} agent={a} />
				))}
			</Carousel>
		</div>
	</section>
);

const COLLECTIONS = [
	{ title: 'Skandinav', desc: 'Tabiiy ranglar, ingichka oyoqlar', type: ProductType.SOFA, color: '#b9b2a5', q: 'material=FABRIC' },
	{ title: 'Velur lyuks', desc: 'Chuqur rang va yumshoq tuk', type: ProductType.CORNER_SOFA, color: '#3f6b6a', q: 'material=VELVET' },
	{ title: 'Sokin yotoqxona', desc: 'Karavot va matras to‘plamlari', type: ProductType.BED, color: '#5b6b8c', q: 'type=BED' },
	{ title: 'Bolalar xonasi', desc: 'Xavfsiz va yuviladigan', type: ProductType.KIDS, color: '#e6b85c', q: 'type=KIDS' },
];

/** Nestar: Events — bu yerda uslub kolleksiyalari */
export const Collections = () => (
	<section className="collections">
		<div className="container col">
			<SectionHead title="Uslub kolleksiyalari" desc="Interyer dizaynerlarimiz tuzgan to'plamlar" light />
			<div className="collection-grid">
				{COLLECTIONS.map((c, i) => (
					<Link key={c.title} href={`/product?${c.q}`} className="collection">
						<FurnitureArt type={c.type} color={c.color} variant={i} />
						<div className="txt">
							<strong>{c.title}</strong>
							<span>{c.desc}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	</section>
);

export const CommunityBoards = () => {
	const [tab, setTab] = useState<BoardArticleCategory>(BoardArticleCategory.INTERIOR);
	const tabs = [BoardArticleCategory.INTERIOR, BoardArticleCategory.RECOMMEND, BoardArticleCategory.NEWS, BoardArticleCategory.FREE];
	const names: Record<BoardArticleCategory, string> = {
		INTERIOR: 'Interyer',
		RECOMMEND: 'Tavsiyalar',
		NEWS: 'Yangiliklar',
		FREE: 'Erkin mavzu',
	};
	const list = articles.filter((a) => a.articleCategory === tab);
	const rest = articles.filter((a) => a.articleCategory !== tab);
	return (
		<section className="community-board">
			<div className="container col">
				<SectionHead
					title="Hamjamiyat"
					desc="Xaridorlarning tajribasi va interyer maslahatlari"
					more={{ href: `/community?articleCategory=${tab}`, label: 'Barcha maqolalar' }}
				/>
				<div className="pill-tabs" role="tablist">
					{tabs.map((t) => (
						<button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
							{names[t]}
						</button>
					))}
				</div>
				<div className="community-grid">
					{[...list, ...rest].slice(0, 3).map((a) => (
						<ArticleCard key={a._id} article={a} />
					))}
				</div>
			</div>
		</section>
	);
};
