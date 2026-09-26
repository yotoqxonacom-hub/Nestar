import { CommentGroup, CommentStatus } from '../enums/comment.enum';
import { Member } from './member';

export interface Comment {
	_id: string;
	commentStatus: CommentStatus;
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	memberData?: Member;
	/** frontend only: rating stars shown on product reviews */
	rating?: number;
}
