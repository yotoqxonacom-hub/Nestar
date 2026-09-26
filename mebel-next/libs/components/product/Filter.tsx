import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProductLocation, ProductMaterial, ProductType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product';
import { locationLabel, materialLabel, typeLabel } from '../../utils';
import { seatOptions } from '../../config';

export type Search = ProductsInquiry['search'];

interface Props {
	search: Search;
	setSearch: (s: Search) => void;
	counts: Record<string, number>;
}

const toggle = <T,>(list: T[] | undefined, v: T) => {
	const l = list ?? [];
	const next = l.includes(v) ? l.filter((x) => x !== v) : [...l, v];
	return next.length ? next : undefined;
};

/** Nestar: property/Filter.tsx — chap tomondagi qidiruv filtri */
const Filter = ({ search, setSearch, counts }: Props) => {
	const locations = [ProductLocation.TASHKENT, ProductLocation.SAMARKAND, ProductLocation.BUKHARA, ProductLocation.FERGANA, ProductLocation.ANDIJAN, ProductLocation.NAMANGAN, ProductLocation.KHOREZM, ProductLocation.NAVOI];

	return (
		<div className="filter-config">
			<div className="find-your-home">
				<strong>Mebel qidirish</strong>
				<div className="input-row">
					<label className="input-box">
						<SearchIcon />
						<input
							id="filter-text"
							placeholder="Model nomi"
							value={search.text ?? ''}
							onChange={(e) => setSearch({ ...search, text: e.target.value || undefined })}
						/>
					</label>
					<button className="reset" onClick={() => setSearch({})} aria-label="Filtrni tozalash" title="Filtrni tozalash">
						<RefreshIcon />
					</button>
				</div>
			</div>

			<div className="find-your-home">
				<strong>Turi</strong>
				{Object.values(ProductType).map((t) => (
					<FormControlLabel
						key={t}
						control={
							<Checkbox size="small" checked={!!search.typeList?.includes(t)} onChange={() => setSearch({ ...search, typeList: toggle(search.typeList, t) })} />
						}
						label={
							<span className="check-label">
								{typeLabel[t]} <small>{counts[t] ?? 0}</small>
							</span>
						}
					/>
				))}
			</div>

			<div className="find-your-home">
				<strong>Material</strong>
				{Object.values(ProductMaterial).map((m) => (
					<FormControlLabel
						key={m}
						control={
							<Checkbox
								size="small"
								checked={!!search.materialList?.includes(m)}
								onChange={() => setSearch({ ...search, materialList: toggle(search.materialList, m) })}
							/>
						}
						label={<span className="check-label">{materialLabel[m]}</span>}
					/>
				))}
			</div>

			<div className="find-your-home">
				<strong>O'rindiqlar soni</strong>
				<div className="button-group">
					<button className={!search.seatsList ? 'active' : ''} onClick={() => setSearch({ ...search, seatsList: undefined })}>
						Har qanday
					</button>
					{seatOptions.map((s) => (
						<button
							key={s}
							className={search.seatsList?.includes(s) ? 'active' : ''}
							onClick={() => setSearch({ ...search, seatsList: toggle(search.seatsList, s) })}
						>
							{s === 5 ? '5+' : s}
						</button>
					))}
				</div>
			</div>

			<div className="find-your-home">
				<strong>Imkoniyatlar</strong>
				<FormControlLabel
					control={
						<Checkbox
							size="small"
							checked={!!search.options?.includes('productFoldable')}
							onChange={() => setSearch({ ...search, options: toggle(search.options, 'productFoldable') })}
						/>
					}
					label={<span className="check-label">Yig'iladigan mexanizm</span>}
				/>
				<FormControlLabel
					control={
						<Checkbox
							size="small"
							checked={!!search.options?.includes('productInstallment')}
							onChange={() => setSearch({ ...search, options: toggle(search.options, 'productInstallment') })}
						/>
					}
					label={<span className="check-label">Bo'lib to'lash mumkin</span>}
				/>
			</div>

			<div className="find-your-home">
				<strong>Shahar (shourum)</strong>
				{locations.map((l) => (
					<FormControlLabel
						key={l}
						control={
							<Checkbox
								size="small"
								checked={!!search.locationList?.includes(l)}
								onChange={() => setSearch({ ...search, locationList: toggle(search.locationList, l) })}
							/>
						}
						label={<span className="check-label">{locationLabel[l]}</span>}
					/>
				))}
			</div>

			<div className="find-your-home">
				<strong>Narx oralig'i, so'm</strong>
				<div className="price-row">
					<input
						id="price-min"
						type="number"
						min={0}
						step={100000}
						placeholder="dan"
						value={search.pricesRange?.start ?? ''}
						onChange={(e) =>
							setSearch({ ...search, pricesRange: { start: Number(e.target.value) || 0, end: search.pricesRange?.end ?? 50000000 } })
						}
					/>
					<span>—</span>
					<input
						id="price-max"
						type="number"
						min={0}
						step={100000}
						placeholder="gacha"
						value={search.pricesRange?.end ?? ''}
						onChange={(e) =>
							setSearch({ ...search, pricesRange: { start: search.pricesRange?.start ?? 0, end: Number(e.target.value) || 50000000 } })
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Filter;
