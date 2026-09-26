import React, { useState } from 'react';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReportGroup, ReportReason } from '../../enums/report.enum';
import { reportGroupLabel, reportReasonLabel } from '../../utils';
import { userVar } from '../../../apollo/store';

/** Reasons that make sense for each target (Report.reportReason) */
const REASONS: Record<ReportGroup, ReportReason[]> = {
	[ReportGroup.PRODUCT]: [ReportReason.WRONG_DESCRIPTION, ReportReason.POOR_QUALITY, ReportReason.FAKE_PRODUCT, ReportReason.OTHER],
	[ReportGroup.MEMBER]: [ReportReason.RUDE_AGENT, ReportReason.NOT_DELIVERED, ReportReason.FAKE_PRODUCT, ReportReason.OTHER],
	[ReportGroup.ARTICLE]: [ReportReason.WRONG_DESCRIPTION, ReportReason.OTHER],
};

interface Props {
	group: ReportGroup;
	refId: string;
	targetName: string;
	className?: string;
	label?: string;
	defaultOpen?: boolean;
}

/** "Report" button + dialog. With a backend this sends the CREATE_REPORT mutation. */
const ReportDialog = ({ group, targetName, className = '', label = 'Report', defaultOpen = false }: Props) => {
	const user = useReactiveVar(userVar);
	const [open, setOpen] = useState(defaultOpen);
	const [reason, setReason] = useState<ReportReason | null>(null);
	const [desc, setDesc] = useState('');
	const [sent, setSent] = useState(false);

	const close = () => {
		setOpen(false);
		setTimeout(() => {
			setSent(false);
			setReason(null);
			setDesc('');
		}, 200);
	};

	return (
		<>
			<button type="button" className={`report-trigger ${className}`} onClick={() => setOpen(true)}>
				<OutlinedFlagIcon /> {label}
			</button>
			<Dialog open={open} onClose={close} PaperProps={{ className: 'report-dialog' }} maxWidth={false}>
				<div className="rd-head">
					<span className="rd-icon">
						<OutlinedFlagIcon />
					</span>
					<div>
						<strong>Report {reportGroupLabel[group].toLowerCase()}</strong>
						<span>{targetName}</span>
					</div>
					<IconButton aria-label="Close" onClick={close}>
						<CloseIcon />
					</IconButton>
				</div>

				{!user?._id ? (
					<div className="rd-body rd-login">
						<p>Please log in to send a report. Reports are reviewed by our admins within 24 hours.</p>
						<Link href="/account/join" className="btn-dark">
							Login
						</Link>
					</div>
				) : sent ? (
					<div className="rd-body rd-done">
						<CheckCircleOutlineIcon />
						<strong>Thanks, your report was sent</strong>
						<p>
							An admin will review it within 24 hours. You can follow its status in <Link href="/mypage?category=reports">My Page → My Reports</Link>.
						</p>
						<button className="btn-dark" onClick={close}>
							Done
						</button>
					</div>
				) : (
					<form
						className="rd-body"
						onSubmit={(e) => {
							e.preventDefault();
							if (reason) setSent(true);
						}}
					>
						<span className="rd-label">What is wrong?</span>
						<div className="rd-reasons" role="radiogroup">
							{REASONS[group].map((r) => (
								<label key={r} className={reason === r ? 'active' : ''}>
									<input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
									<i />
									{reportReasonLabel[r]}
								</label>
							))}
						</div>
						<label className="rd-label" htmlFor="report-desc">
							Details <small>(optional)</small>
						</label>
						<textarea
							id="report-desc"
							maxLength={500}
							placeholder="Tell us what happened so the admin can check it faster"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
						/>
						<div className="rd-foot">
							<span>{desc.length}/500 · one report per item</span>
							<button type="submit" className="btn-accent" disabled={!reason}>
								Send report
							</button>
						</div>
					</form>
				)}
			</Dialog>
		</>
	);
};

export default ReportDialog;
