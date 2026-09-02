import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { CommentGroup } from '../../enums/comment.enum (1)';
import { Direction } from '../../enums/common.enum';
import { availableCommentsSorts } from "../../config";

@InputType()
export class CommentInput {
	@IsNotEmpty()
	@Field(() => CommentGroup)
	commentGroup: CommentGroup | undefined;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	commentContent: string | undefined;

	@IsNotEmpty()
	@Field(() => String)
	commentRefId: ObjectId | undefined;

	memberId?: ObjectId;
}

@InputType()
class CISearch {
	@IsNotEmpty()
	@Field(() => String)
	commentRefId: ObjectId | undefined;
}

@InputType()
export class CommentsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number | undefined;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number | undefined;

	@IsOptional()
	@IsIn(availableCommentsSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => CISearch)
	search: CISearch | undefined;
}
