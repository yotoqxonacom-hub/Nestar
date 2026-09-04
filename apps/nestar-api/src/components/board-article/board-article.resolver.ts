import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { UseGuards } from '@nestjs/common';
import BoardArticles, { BoardArticle, } from '../../libs/dto/board-articles/board-article (1)';
import { AllBoardArticlesInquiry, BoardArticleInput, BoardArticlesInquiry } from '../../libs/dto/board-articles/board-article.input (1)';
import mongoose, * as mongoose_1 from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard (1)';
import { shapeIntoMongoObjectId } from '../../libs/config';
import * as mongoose_2 from 'mongoose';
import { BoardArticleUpdate } from '../../libs/dto/board-articles/board-article.update (1)';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator (2)';
import { RolesGuard } from '../auth/guards/roles.guard (1)';



@Resolver()
export class BoardArticleResolver {
    constructor(private readonly boardArticleService: BoardArticleService) { }


    @UseGuards(AuthGuard)
    @Mutation((returns) => BoardArticle)
    public async createBoardArticle(
        @Args('input') input: BoardArticleInput,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation: createBoardArticle');
        return this.boardArticleService.createBoardArticle(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => BoardArticle)
    public async getBoardArticle(
        @Args('articleId') input: string,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Query: getProperty');
        const articleId = shapeIntoMongoObjectId(input);
        return await this.boardArticleService.getBoardArticle(memberId, articleId);
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => BoardArticle)
    public async updateBoardArticle(
        @Args('input') input: BoardArticleUpdate,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation updateBoardArticle');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.boardArticleService.updateBoardArticle(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => BoardArticles)
    public async getBoardArticles(
        @Args('input') input: BoardArticlesInquiry,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticles> {
        console.log('query: getBoardArticles');
        return await this.boardArticleService.getBoardArticles(memberId, input);
    }


    @UseGuards(AuthGuard)
    @Mutation(() => BoardArticle)
    public async likeTargetBoardArticle(
        @Args('boardArticleId') input: string,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation: likeTargetBoardArticle');
        const likeRefId = shapeIntoMongoObjectId(input);
        return await this.boardArticleService.likeTargetBoardArticle(memberId, likeRefId) as unknown as BoardArticle;
    }


    /** ADMIN **/

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => BoardArticles)
    public async getAllBoardArticlesByAdmin(
        @Args('input') input: AllBoardArticlesInquiry,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticles> {
        console.log('query: getAllBoardArticlesByAdmin');
        return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
    }


    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => BoardArticle)
    public async updateBoardArticleByAdmin(
        @Args('input') input: BoardArticleUpdate,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation updateBoardArticleByAdmin');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.boardArticleService.updateBoardArticleByAdmin(input);
    }


    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => BoardArticle)
    public async removeBoardArticleByAdmin(
        @Args('articleId') input: string,
        @AuthMember('_id') memberId: mongoose.ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation removeBoardArticleByAdmin');
        const articleId = shapeIntoMongoObjectId(input);
        return await this.boardArticleService.removeBoardArticleByAdmin(articleId);
    }


}



