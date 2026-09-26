import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Drawer, Pagination } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CloseIcon from '@mui/icons-material/Close';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter, { Search } from '../../libs/components/product/Filter';
import ProductCard from '../../libs/components/common/ProductCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { products } from '../../libs/data/mock';
import { ProductLocation, ProductMaterial, ProductType } from '../../libs/enums/product.enum';
import { finalPrice, locationLabel, materialLabel, typeLabel } from '../../libs/utils';
import { Product } from '../../libs/types/product';

const SORTS: Record<string, { label: string; fn: (a: Product, b: Product) => number }> = {
	createdAt: { label: 'Yangi', fn: (a, b) => b.createdAt.localeCompare(a.createdAt) },
	priceAsc: { label: 'Arzonroq', fn: (a, b) => finalPrice(a) - finalPrice(b) },
	priceDesc: { label: 'Qimmatroq', fn: (a, b) => finalPrice(b) - finalPrice(a) },
	productViews: { label: 'Ommabop', fn: (a, b) => b.productViews - a.productViews },
	productRank: { label: 'Reyting', fn: (a, b) => b.productRank - a.productRank },
};

const LIMIT = 9;

/**
 * Katalog. Backend ulanganda filtrlash GET_PRODUCTS(ProductsInquiry) so'roviga o'tadi;
 * hozir xuddi shu inquiry shakli demo ro'yxatga qo'llanadi.
 */
const ProductList: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [search, setSearch] = useState<Search>({});
	const [sort, setSort] = useState('createdAt');
	const [page, setPage] = useState(1);
	const [drawer, setDrawer] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;
		const q = router.query;
		setSearch({
			typeList: q.type ? [q.type as ProductType] : undefined,
			materialList: q.material ? [q.material as ProductMaterial] : undefined,
			locationList: q.location ? [q.location as ProductLocation] : undefined,
			text: (q.text as string) || undefined,
		});
		if (q.sort && SORTS[q.sort as string]) setSort(q.sort as string);
	}, [router.isReady, router.query]);

	useEffect(() => setPage(1), [search, sort]);

	const filtered = useMemo(() => {
		const s = search;
		return products
			.filter((p) => !s.typeList || s.typeList.includes(p.productType))
			.filter((p) => !s.materialList || s.materialList.includes(p.productMaterial))
			.filter((p) => !s.locationList || s.locationList.includes(p.productLocation))
			.filter((p) => !s.seatsList || s.seatsList.some((n) => (n === 5 ? p.productSeats >= 5 : p.productSeats === n)))
			.filter((p) => !s.options || s.options.every((o) => p[o]))
			.filter((p) => !s.pricesRange || (finalPrice(p) >= s.pricesRange.start && finalPrice(p) <= s.pricesRange.end))
			.filter((p) => !s.text || p.productName.toLowerCase().includes(s.text.toLowerCase()))
			.sort(SORTS[sort].fn);
	}, [search, sort]);

	const counts = useMemo(() => {
		const c: Record<string, number> = {};
		products.forEach((p) => (c[p.productType] = (c[p.productType] ?? 0) + 1));
		return c;
	}, []);

	const chips = [
		...(search.typeList ?? []).map((t) => ({ label: typeLabel[t], clear: () => setSearch({ ...search, typeList: search.typeList!.filter((x) => x !== t).length ? search.typeList!.filter((x) => x !== t) : undefined }) })),
		...(search.materialList ?? []).map((m) => ({ label: materialLabel[m], clear: () => setSearch({ ...search, materialList: search.materialList!.filter((x) => x !== m).length ? search.materialList!.filter((x) => x !== m) : undefined }) })),
		...(search.locationList ?? []).map((l) => ({ label: locationLabel[l], clear: () => setSearch({ ...search, locationList: search.locationList!.filter((x) => x !== l).length ? search.locationList!.filter((x) => x !== l) : undefined }) })),
		...(search.text ? [{ label: `«${search.text}»`, clear: () => setSearch({ ...search, text: undefined }) }] : []),
	];

	const pageList = filtered.slice((page - 1) * LIMIT, page * LIMIT);
	const pages = Math.ceil(filtered.length / LIMIT);

	return (
		<div className="product-page">
			<div className="container">
				{device === 'desktop' ? (
					<aside className="left-config">
						<Filter search={search} setSearch={setSearch} counts={counts} />
					</aside>
				) : (
					<Drawer anchor="bottom" open={drawer} onClose={() => setDrawer(false)} PaperProps={{ className: 'm-filter-sheet' }}>
						<div className="sheet-head">
							<strong>Filtr</strong>
							<button onClick={() => setDrawer(false)} aria-label="Yopish">
								<CloseIcon />
							</button>
						</div>
						<Filter search={search} setSearch={setSearch} counts={counts} />
						<button className="btn-accent sheet-apply" onClick={() => setDrawer(false)}>
							{filtered.length} ta mahsulotni ko'rsatish
						</button>
					</Drawer>
				)}

				<div className="main-config">
					<div className="list-top">
						<span className="found">
							<b>{filtered.length}</b> ta mahsulot topildi
						</span>
						<div className="list-actions">
							{device === 'mobile' && (
								<button className="filter-btn" onClick={() => setDrawer(true)}>
									<TuneIcon /> Filtr {chips.length > 0 && <em>{chips.length}</em>}
								</button>
							)}
							<label className="sort">
								<span>Saralash:</span>
								<select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
									{Object.entries(SORTS).map(([k, v]) => (
										<option key={k} value={k}>
											{v.label}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>
					{chips.length > 0 && (
						<div className="active-chips">
							{chips.map((c) => (
								<button key={c.label} onClick={c.clear}>
									{c.label} <CloseIcon />
								</button>
							))}
							<button className="clear" onClick={() => setSearch({})}>
								Hammasini tozalash
							</button>
						</div>
					)}
					{pageList.length === 0 ? (
						<div className="empty-list">
							<SearchOffIcon />
							<strong>Bunday mahsulot topilmadi</strong>
							<span>Filtrni yumshatib ko'ring yoki boshqa so'z bilan qidiring.</span>
							<button className="btn-outline" onClick={() => setSearch({})}>
								Filtrni tozalash
							</button>
						</div>
					) : (
						<div className="product-grid">
							{pageList.map((p) => (
								<ProductCard key={p._id} product={p} />
							))}
						</div>
					)}
					{pages > 1 && (
						<div className="pagination-config">
							<Pagination page={page} count={pages} onChange={(_, v) => setPage(v)} shape="circular" color="primary" />
							<span>
								Jami {filtered.length} ta mahsulotdan {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(ProductList);
