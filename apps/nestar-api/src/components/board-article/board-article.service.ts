import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import mongoose, { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { InjectModel } from '@nestjs/mongoose';
import BoardArticles, { BoardArticle } from '../../libs/dto/board-articles/board-article (1)';
import { Direction, Message } from '../../libs/enums/common.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum (1)';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum (1)';
import { BoardArticleUpdate } from '../../libs/dto/board-articles/board-article.update (1)';
import { AllBoardArticlesInquiry, BoardArticlesInquiry } from '../../libs/dto/board-articles/board-article.input (1)';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum (1)';

@Injectable()
export class BoardArticleService {
    constructor(@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService
    ) { }

    public async createBoardArticle(memberId: any, input: any): Promise<BoardArticle> {
        input.memberId = memberId;
        try {
            const result = await this.boardArticleModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: "memberArticles",
                modifier: 1
            });
            return result as unknown as BoardArticle;
        } catch (err) {
            console.log(
                "Error on serviceModel while createBoardArticle:",
                err instanceof Error ? err.message : String(err));
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }


    public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> {
        const search: T = {
            _id: articleId,
            articleStatus: BoardArticleStatus.ACTIVE,
        };

        const targetBoardArticle: BoardArticle | null = await this.boardArticleModel.findOne(search).lean().exec();
        if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE };
            const newView = await this.viewService.recordView(viewInput);
            console.log("VIEW INPUT:", viewInput);
            console.log("NEW VIEW:", newView);

            if (newView) {
                await this.boardArticleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
                if (targetBoardArticle.articleViews !== undefined) {
                    targetBoardArticle.articleViews++;
                }
            }
            // meliked
        }

        if (targetBoardArticle.memberId) {
            targetBoardArticle.memberData = await this.memberService.getMember(null as any, targetBoardArticle.memberId);
        }
        return targetBoardArticle;
    }


    public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
        const { _id, articleStatus } = input;

        const result = await this.boardArticleModel
            .findOneAndUpdate({ _id: _id, memberId: memberId, articleStatus: BoardArticleStatus.ACTIVE }, input, {
                new: true,
            })
            .exec();

        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (articleStatus === BoardArticleStatus.DELETE) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: -1,
            });
        }

        return result;
    }


    public async getBoardArticles(
        memberId: ObjectId,
        input: BoardArticlesInquiry,
    ): Promise<BoardArticles> {

        const { articleCategory, text } = input.search ?? {};

        const match: T = {
            articleStatus: BoardArticleStatus.ACTIVE,
        };

        const sort: T = {
            [input.sort ?? "createdAt"]:
                input?.direction ?? Direction.DESC,
        };

        if (articleCategory) {
            match.articleCategory = articleCategory;
        }

        if (text) {
            match.articleTitle = {
                $regex: new RegExp(text, "i"),
            };
        }

        if (input.search?.memberId) {
            match.memberId = shapeIntoMongoObjectId(
                input.search.memberId,
            );
        }

        console.log("match:", match);

        const result = await this.boardArticleModel
            .aggregate([
                { $match: match },

                { $sort: sort },

                {
                    $facet: {
                        list: [
                            {
                                $skip:
                                    ((input.page ?? 1) - 1) *
                                    (input.limit ?? 10),
                            },
                            {
                                $limit: input.limit ?? 10,
                            },
                        ],

                        metaCounter: [
                            {
                                $count: "total",
                            },
                        ],
                    },
                },
            ])
            .exec();

        if (!result.length) {
            throw new InternalServerErrorException(
                Message.NO_DATA_FOUND,
            );
        }

        const data = result[0];

        const total = data.metaCounter[0]?.total ?? 0;

        return {
            ...data,
            metaCounter: [{ total }],
        };
    }



    public async likeTargetBoardArticle(
        memberId: mongoose.ObjectId,
        likeRefId: mongoose.ObjectId,
    ): Promise<BoardArticle | null> {

        const target = await this.boardArticleModel.findOne({
            _id: likeRefId,
            articleStatus: BoardArticleStatus.ACTIVE,
        });

        if (!target) {
            throw new InternalServerErrorException('NO_DATA_FOUND');
        }

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.PROPERTY,
        };

        const modifier: number = await this.likeService.toggleLike(input);

        const result = await this.boardArticleStatsEditor({
            _id: likeRefId,
            targetKey: 'articleLikes',
            modifier,
        });

        if (!result) {
            throw new InternalServerErrorException('SOMETHING_WENT_WRONG');
        }

        return result;
    }




    /** ADMIN **/
    public async getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): Promise<BoardArticles> {
        const { articleStatus, articleCategory } = input.search ?? {};
        const match: T = {};
        const sort: T = { [input.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };

        if (articleStatus) match.articleStatus = articleStatus;
        if (articleCategory) match.articleCategory = articleCategory;

        const result = await this.boardArticleModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: ((input.page ?? 1) - 1) * (input.limit ?? 10) },
                        { $limit: input.limit ?? 10 },
                        lookupMember,
                        { $unwind: "$memberData" },
                    ],
                    metaCounter: [
                        { $count: "total" }
                    ]
                },
            },
        ]).exec();

        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        const data = result[0];

        const total = data.metaCounter[0]?.total ?? 0;

        return {
            ...data,
            metaCounter: [{ total }],
        };
    }


    public async updateBoardArticleByAdmin(input: BoardArticleUpdate): Promise<BoardArticle> {
        const { _id, articleStatus } = input;

        const result = await this.boardArticleModel
            .findOneAndUpdate({ _id: _id, articleStatus: BoardArticleStatus.ACTIVE }, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (articleStatus === BoardArticleStatus.DELETE && result.memberId) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberArticles',
                modifier: -1,
            });
        }

        return result;
    }

    public async removeBoardArticleByAdmin(articleId: ObjectId): Promise<BoardArticle> {
        const search: T = { _id: articleId, articleStatus: BoardArticleStatus.DELETE };
        const result = await this.boardArticleModel.findOneAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }





    public async boardArticleStatsEditor(input: StatisticModifier): Promise<BoardArticle | null> {
        const { _id, targetKey, modifier } = input;
        return await this.boardArticleModel
            .findByIdAndUpdate(
                _id,
                { $inc: { [targetKey]: modifier } },
                { new: true },
            )
            .exec();
    }

}
