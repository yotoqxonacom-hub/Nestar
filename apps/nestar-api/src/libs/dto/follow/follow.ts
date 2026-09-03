import { Field, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class MeFollowed {
	@Field(() => String)
	followingId!: mongoose.ObjectId;

	@Field(() => String)
	followerId!: mongoose.ObjectId;

	@Field(() => Boolean)
	myFollowing: boolean | undefined;
}

@ObjectType()
export class Follower {
	@Field(() => String)
	_id!: mongoose.ObjectId;

	@Field(() => String)
	followingId!: mongoose.ObjectId;

	@Field(() => String)
	followerId!: mongoose.ObjectId;

	@Field(() => Date)
	createdAt: Date | undefined;

	@Field(() => Date)
	updatedAt: Date | undefined;

	/** from aggregation **/

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => [MeFollowed], { nullable: true })
	meFollowed?: MeFollowed[];

	@Field(() => Member, { nullable: true })
	followerData?: Member;
}

@ObjectType()
export class Following {
	@Field(() => String)
	_id!: mongoose.ObjectId;

	@Field(() => String)
	followingId!: mongoose.ObjectId;

	@Field(() => String)
	followerId!: mongoose.ObjectId;

	@Field(() => Date)
	createdAt: Date | undefined;

	@Field(() => Date)
	updatedAt: Date | undefined;

	/** from aggregation **/

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => [MeFollowed], { nullable: true })
	meFollowed?: MeFollowed[];

	@Field(() => Member, { nullable: true })
	followingData?: Member;
}

@ObjectType()
export class Followings {
	@Field(() => [Following])
	list: Following[] | undefined;

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[] | undefined;
}

@ObjectType()
export class Followers {
	@Field(() => [Follower])
	list: Follower[] | undefined;

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[] | undefined;
}
