import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { faqs, notices } from '../../libs/data/mock';
import { formatDate } from '../../libs/utils';
import { SUPPORT_PHONE } from '../../libs/config';

const TABS = [
	{ key: 'notice', label: "E'lonlar", icon: <CampaignOutlinedIcon /> },
	{ key: 'faq', label: 'Savol-javob', icon: <HelpOutlineIcon /> },
	{ key: 'inquiry', label: 'Murojaat', icon: <ForumOutlinedIcon /> },
];

/** Nestar: cs/index — Notice (FAQ / TERMS / INQUIRY) */
const CS: NextPage = () => {
	const router = useRouter();
	const tab = (router.query.tab as string) || 'notice';
	const [group, setGroup] = useState('Barchasi');
	const [sent, setSent] = useState(false);
	const groups = ['Barchasi', ...Array.from(new Set(faqs.map((f) => f.group)))];

	return (
		<div className="cs-page">
			<div className="container col">
				<div className="cs-tabs">
					{TABS.map((t) => (
						<button
							key={t.key}
							className={tab === t.key ? 'active' : ''}
							onClick={() => router.push(`/cs?tab=${t.key}`, undefined, { shallow: true })}
						>
							{t.icon}
							{t.label}
						</button>
					))}
				</div>

				{tab === 'notice' && (
					<div className="notice-list">
						<div className="row head">
							<span>№</span>
							<span>Sarlavha</span>
							<span>Sana</span>
						</div>
						{notices.map((n, i) => (
							<details className="row" key={n._id}>
								<summary>
									<span className="tabular">{notices.length - i}</span>
									<b>{n.noticeTitle}</b>
									<span>{formatDate(n.createdAt)}</span>
								</summary>
								<p>{n.noticeContent}</p>
							</details>
						))}
					</div>
				)}

				{tab === 'faq' && (
					<div className="faq-box">
						<div className="pill-tabs">
							{groups.map((g) => (
								<button key={g} className={group === g ? 'active' : ''} onClick={() => setGroup(g)}>
									{g}
								</button>
							))}
						</div>
						<div className="faq-list">
							{faqs
								.filter((f) => group === 'Barchasi' || f.group === group)
								.map((f) => (
									<Accordion key={f.q} disableGutters elevation={0}>
										<AccordionSummary expandIcon={<ExpandMoreIcon />}>
											<span className="q">Q</span>
											{f.q}
										</AccordionSummary>
										<AccordionDetails>{f.a}</AccordionDetails>
									</Accordion>
								))}
						</div>
					</div>
				)}

				{tab === 'inquiry' && (
					<div className="inquiry-box">
						<div className="contact">
							<h3>Biz bilan bog'laning</h3>
							<p>Qo'ng'iroq markazi har kuni 9:00 dan 21:00 gacha ishlaydi.</p>
							<b>{SUPPORT_PHONE}</b>
							<span>Telegram: @nestar_mebel</span>
						</div>
						{sent ? (
							<div className="sent">
								<CheckCircleOutlineIcon />
								<strong>Murojaatingiz qabul qilindi</strong>
								<span>Javobni 24 soat ichida SMS orqali yuboramiz.</span>
							</div>
						) : (
							<form
								className="inquiry-form"
								onSubmit={(e) => {
									e.preventDefault();
									setSent(true);
								}}
							>
								<div className="form-field">
									<label htmlFor="inq-name">Ismingiz</label>
									<input id="inq-name" required />
								</div>
								<div className="form-field">
									<label htmlFor="inq-phone">Telefon</label>
									<input id="inq-phone" required placeholder="+998" />
								</div>
								<div className="form-field wide">
									<label htmlFor="inq-topic">Mavzu</label>
									<select id="inq-topic">
										<option>Buyurtma holati</option>
										<option>Yetkazib berish</option>
										<option>Kafolat va qaytarish</option>
										<option>Sotuvchi bo'lish</option>
										<option>Boshqa</option>
									</select>
								</div>
								<div className="form-field wide">
									<label htmlFor="inq-text">Xabar</label>
									<textarea id="inq-text" required />
								</div>
								<button className="btn-accent wide" type="submit">
									Yuborish
								</button>
							</form>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutBasic(CS);
