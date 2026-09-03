import { Field, ObjectType } from '@nestjs/graphql';
import { LikeGroup } from '../../enums/like.enum (1)';
import * as mongoose from 'mongoose';

@ObjectType()
export class MeLiked {
	@Field(() => String)
	memberId!: mongoose.ObjectId;

	@Field(() => String)
	likeRefId: mongoose.ObjectId | undefined;

	@Field(() => Boolean)
	myFavorite: boolean | undefined;
}

@ObjectType()
export class Like {
	@Field(() => String)
	_id!: mongoose.ObjectId;

	@Field(() => LikeGroup)
	likeGroup: LikeGroup | undefined;

	@Field(() => String)
	likeRefId: mongoose.ObjectId | undefined;

	@Field(() => String)
	memberId: mongoose.ObjectId | undefined;

	@Field(() => Date)
	createdAt: Date | undefined;

	@Field(() => Date)
	updatedAt: Date | undefined;
}


