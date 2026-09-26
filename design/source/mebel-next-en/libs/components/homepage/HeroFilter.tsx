import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { ProductLocation, ProductMaterial, ProductType } from '../../enums/product.enum';
import { locationLabel, materialLabel, typeLabel } from '../../utils';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FurnitureArt from '../common/FurnitureArt';

/** Bosh sahifa hero bloki + qidiruv filtri (Nestar: FiberContainer + HeaderFilter) */
const HeroFilter = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [type, setType] = useState('');
	const [material, setMaterial] = useState('');
	const [location, setLocation] = useState('');
	const [text, setText] = useState('');

	const search = (e?: React.FormEvent) => {
		e?.preventDefault();
		const q = new URLSearchParams();
		if (type) q.set('type', type);
		if (material) q.set('material', material);
		if (location) q.set('location', location);
		if (text) q.set('text', text);
		router.push(`/product${q.toString() ? `?${q}` : ''}`);
	};

	return (
		<section className="hero">
			<div className="container hero-inner">
				<div className="hero-copy">
					<span className="eyebrow">Autumn collection · 2026</span>
					<h1>
						Bring <em>softness</em> home
					</h1>
					<p>
						Sofas, armchairs and upholstered beds from 40+ trusted agents across Korea. Free delivery and up to 12
						interest-free installments.
					</p>
					<div className="hero-stats">
						<div>
							<b>1 200+</b>
							<span>products</span>
						</div>
						<div>
							<b>40+</b>
							<span>agents</span>
						</div>
						<div>
							<b>4.9</b>
							<span>average rating</span>
						</div>
					</div>
				</div>
				<div className="hero-visual">
					<div className="hero-card main">
						<FurnitureArt type={ProductType.CORNER_SOFA} color="#3f6b6a" variant={0} />
					</div>
					{device === 'desktop' && (
						<>
							<div className="hero-card small a">
								<FurnitureArt type={ProductType.ARMCHAIR} color="#c9a27a" variant={1} />
							</div>
							<div className="hero-card small b">
								<FurnitureArt type={ProductType.POUF} color="#d98b7e" variant={2} />
							</div>
							<div className="hero-price">
								<span>Verona Corner Sofa</span>
								<b>$1,177</b>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="container">
				<form className="search-box" onSubmit={search}>
					<label className="field text">
						<SearchIcon />
						<input id="hero-text" placeholder="What are you looking for? e.g. velvet sofa" value={text} onChange={(e) => setText(e.target.value)} />
					</label>
					<label className="field">
						<span>Type</span>
						<select id="hero-type" value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">All types</option>
							{Object.values(ProductType).map((t) => (
								<option key={t} value={t}>
									{typeLabel[t]}
								</option>
							))}
						</select>
					</label>
					<label className="field">
						<span>Material</span>
						<select id="hero-material" value={material} onChange={(e) => setMaterial(e.target.value)}>
							<option value="">All materials</option>
							{Object.values(ProductMaterial).map((m) => (
								<option key={m} value={m}>
									{materialLabel[m]}
								</option>
							))}
						</select>
					</label>
					<label className="field">
						<span>Location</span>
						<select id="hero-location" value={location} onChange={(e) => setLocation(e.target.value)}>
							<option value="">All of Korea</option>
							{Object.values(ProductLocation).map((l) => (
								<option key={l} value={l}>
									{locationLabel[l]}
								</option>
							))}
						</select>
					</label>
					<button type="button" className="advanced" onClick={() => router.push('/product')}>
						<TuneIcon /> Advanced
					</button>
					<button type="submit" className="go" aria-label="Search">
						<SearchIcon />
						<span>Search</span>
					</button>
				</form>
				<ul className="perks">
					<li>
						<LocalShippingOutlinedIcon /> Free delivery over $400
					</li>
					<li>
						<CreditCardOutlinedIcon /> Up to 12 monthly installments
					</li>
					<li>
						<VerifiedOutlinedIcon /> 3-year frame warranty
					</li>
				</ul>
			</div>
		</section>
	);
};

export default HeroFilter;
