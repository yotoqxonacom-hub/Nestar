import { BoardArticleCategory, BoardArticleStatus } from '../enums/board-article.enum';
import { Member, MeLiked } from './member';

export interface BoardArticle {
	_id: string;
	articleCategory: BoardArticleCategory;
	articleStatus: BoardArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImage: string;
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	meLiked?: MeLiked[];
	memberData?: Member;
}
