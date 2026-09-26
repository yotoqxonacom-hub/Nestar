import { ReportGroup, ReportReason, ReportStatus } from '../enums/report.enum';
import { Member } from './member';

export interface Report {
	_id: string;
	reportStatus: ReportStatus;
	reportGroup: ReportGroup;
	reportReason: ReportReason;
	reportDesc?: string;
	reportRefId: string;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	/** from aggregation **/
	memberData?: Member;
	/** frontend helper: name of the reported item */
	targetName?: string;
}
