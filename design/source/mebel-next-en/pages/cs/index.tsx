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
	{ key: 'notice', label: 'Notice', icon: <CampaignOutlinedIcon /> },
	{ key: 'faq', label: 'FAQ', icon: <HelpOutlineIcon /> },
	{ key: 'inquiry', label: 'Inquiry', icon: <ForumOutlinedIcon /> },
];

/** Nestar: cs/index — Notice (FAQ / TERMS / INQUIRY) */
const CS: NextPage = () => {
	const router = useRouter();
	const tab = (router.query.tab as string) || 'notice';
	const [group, setGroup] = useState('All');
	const [sent, setSent] = useState(false);
	const groups = ['All', ...Array.from(new Set(faqs.map((f) => f.group)))];

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
							<span>No.</span>
							<span>Title</span>
							<span>Date</span>
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
								.filter((f) => group === 'All' || f.group === group)
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
							<h3>Contact us</h3>
							<p>Customer care is open daily from 9:00 to 21:00.</p>
							<b>{SUPPORT_PHONE}</b>
							<span>KakaoTalk: @nestar_furniture</span>
						</div>
						{sent ? (
							<div className="sent">
								<CheckCircleOutlineIcon />
								<strong>Your inquiry has been sent</strong>
								<span>We will reply by SMS within 24 hours.</span>
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
									<label htmlFor="inq-name">Your name</label>
									<input id="inq-name" required />
								</div>
								<div className="form-field">
									<label htmlFor="inq-phone">Phone</label>
									<input id="inq-phone" required placeholder="+82" />
								</div>
								<div className="form-field wide">
									<label htmlFor="inq-topic">Topic</label>
									<select id="inq-topic">
										<option>Order status</option>
										<option>Delivery</option>
										<option>Warranty and returns</option>
										<option>Become an agent</option>
										<option>Other</option>
									</select>
								</div>
								<div className="form-field wide">
									<label htmlFor="inq-text">Message</label>
									<textarea id="inq-text" required />
								</div>
								<button className="btn-accent wide" type="submit">
									Send inquiry
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
