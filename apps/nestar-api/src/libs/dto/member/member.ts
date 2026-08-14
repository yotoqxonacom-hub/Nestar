import { Field, Int, ObjectType } from "@nestjs/graphql";
import * as mongoose from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";




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
    memberArticle?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberFollower?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberFollowing?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberPoints?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberLikes?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberViews?: number | undefined;

    @Field(() => Int, { nullable: true })
    memberComment?: number | undefined;

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

}
