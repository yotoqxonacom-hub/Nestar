import { Field, Int, ObjectType } from "@nestjs/graphql";
import * as mongoose from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { MeLiked } from "../like/like";
import { MeFollowed } from "../follow/follow";




@ObjectType()
export class Member {
    @Field(() => String)
    _id: mongoose.ObjectId | undefined;

    @Field(() => MemberType)
    memberType: MemberType | undefined;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus | undefined;

    @Field(() => MemberAuthType)
    memberAuthType: MemberAuthType | undefined;

    @Field(() => String)
    memberPhone: string | undefined;

    @Field(() => String)
    memberNick: string | undefined;

    memberPassword?: string;

    @Field(() => String, { nullable: true })
    memberFullName?: string;

    @Field(() => String)
    memberImage: string | undefined;

    @Field(() => String, { nullable: true })
    memberAddress?: string;

    @Field(() => String, { nullable: true })
    memberDesc?: string;

    @Field(() => Int, { nullable: true })
    memberProperties?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberArticles?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberFollowers?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberFollowings?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberPoints?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberLikes?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberViews?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberComments?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberRank?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberWarnings?: number | undefined;


    @Field(() => Int, { nullable: true })
    memberBlocks?: number | undefined;


    @Field(() => Date, { nullable: true })
    deletedAt?: Date

    @Field(() => Date)
    createdAt?: Date | undefined

    @Field(() => Date)
    updatedAt?: Date | undefined

    @Field(() => String, { nullable: true })
    accessToken?: string;

    /** from aggregate */

    @Field(() => [MeLiked], { nullable: true })
    meLiked?: MeLiked[];

    @Field(() => [MeFollowed], { nullable: true })
    meFollowed?: MeFollowed[];
}



@ObjectType()
export class TotalCounter {
    @Field(() => Int, { nullable: true })
    total?: number;
}

@ObjectType()
export class Members {
    @Field(() => [Member])
    list?: Member[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter?: TotalCounter[];
}
