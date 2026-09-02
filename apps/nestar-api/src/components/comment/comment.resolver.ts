import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comments/comment.input (1)';
import * as mongoose from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Comment, Comments } from '../../libs/dto/comments/comment (1)';
import { CommentUpdate } from '../../libs/dto/comments/comment.update (1)';
import * as mongoose_1 from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard (1)';

@Resolver()
export class CommentResolver {
    constructor(private readonly commentService: CommentService) { }


    @UseGuards(AuthGuard)
    @Mutation((returns) => Comment)
    public async createComment(
        @Args('input') input: CommentInput,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<Comment> {
        console.log('Mutation: createComment');
        return await this.commentService.createComment(memberId, input) as unknown as Comment;
    }


    @UseGuards(AuthGuard)
    @Mutation(returns => Comment)
    public async updateComment(
        @Args('input') input: CommentUpdate,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<Comment> {
        console.log('Mutation: updateComment');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.commentService.updateComment(memberId, input) as unknown as Comment;
    }



    @UseGuards(WithoutGuard)
    @Query((returns) => Comments)
    public async getComments(
        @Args('input') input: CommentsInquiry,
        @AuthMember('id') memberId: mongoose.ObjectId,
    ): Promise<Comments> {
        console.log('Query: getComments');
        if (input.search?.commentRefId) {
            input.search.commentRefId = shapeIntoMongoObjectId(input.search.commentRefId);
        }
        return await this.commentService.getComments(memberId, input);
    }


}
