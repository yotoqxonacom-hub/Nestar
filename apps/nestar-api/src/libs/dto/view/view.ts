import { Field, Int, ObjectType } from "@nestjs/graphql";
import * as mongoose from "mongoose";
import { ViewGroup } from "../../enums/view.enum (1)";




@ObjectType()
export class View {
    @Field(() => String)
    _id: mongoose.ObjectId | undefined;

    @Field(() => ViewGroup)
    viewGroup: ViewGroup | undefined

    @Field(() => String)
    viewRefId: mongoose.ObjectId | undefined

    @Field(() => String)
    memberId: mongoose.ObjectId | undefined

    @Field(() => Date)
    createdAt?: Date | undefined

    @Field(() => Date)
    updatedAt?: Date | undefined

}