import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum (1)';
import * as mongoose from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class BoardArticle {
	@Field(() => String)
	_id!: mongoose.ObjectId;

	@Field(() => BoardArticleCategory)
	articleCategory: BoardArticleCategory | undefined;

	@Field(() => BoardArticleStatus)
	articleStatus: BoardArticleStatus | undefined;

	@Field(() => String)
	articleTitle: string | undefined;

	@Field(() => String)
	articleContent: string | undefined;

	@Field(() => String, { nullable: true })
	articleImage?: string;

	@Field(() => Int)
	articleViews: number | undefined;

	@Field(() => Int)
	articleLikes: number | undefined;

	@Field(() => Int)
	articleComments: number | undefined;

	@Field(() => String)
	memberId: mongoose.ObjectId | undefined;

	@Field(() => Date)
	createdAt: Date | undefined;

	@Field(() => Date)
	updatedAt: Date | undefined;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class BoardArticles {
	@Field(() => [BoardArticle])
	list: BoardArticle[] | undefined;

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[] | undefined;
}
