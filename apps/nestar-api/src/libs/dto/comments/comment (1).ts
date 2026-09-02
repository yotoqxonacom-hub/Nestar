import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum (1)';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Comment {
	@Field(() => String)
	_id!: mongoose.ObjectId;

	@Field(() => CommentStatus)
	commentStatus: CommentStatus | undefined;

	@Field(() => CommentGroup)
	commentGroup: CommentGroup | undefined;

	@Field(() => String)
	commentContent: string | undefined;

	@Field(() => String)
	commentRefId: mongoose.ObjectId | undefined;

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
export class Comments {
	@Field(() => [Comment])
	list: Comment[] | undefined;

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[] | undefined;
}
