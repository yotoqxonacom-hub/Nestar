import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardArticleService } from '../board-article/board-article.service';
import { PropertyService } from '../property/property.service';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum (1)';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comments/comment.input (1)';
import { Comment, Comments } from '../../libs/dto/comments/comment (1)';
import { CommentUpdate } from '../../libs/dto/comments/comment.update (1)';
import { T } from '../../libs/types/common';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment') private readonly commentModel: Model<Comment>,
        private readonly memberService: MemberService,
        private readonly propertyService: PropertyService,
        private readonly boardArticleService: BoardArticleService,
    ) { }


    public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
        input.memberId = memberId;
        let result: Comment | null = null;

        try {
            result = await this.commentModel.create(input);
        } catch (error) {
            console.error((error as Error).message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }

        switch (input.commentGroup) {
            case CommentGroup.PROPERTY:
                await this.propertyService.propertyStatsEditor({
                    _id: input.commentRefId!,
                    targetKey: 'propertyComments',
                    modifier: 1,
                });
                break;
            case CommentGroup.ARTICLE:
                await this.boardArticleService.boardArticleStatsEditor({
                    _id: input.commentRefId!,
                    targetKey: 'articleComments',
                    modifier: 1,
                });
                break;
            case CommentGroup.MEMBER:
                await this.memberService.memberStatsEditor({
                    _id: input.commentRefId!,
                    targetKey: 'memberComments',
                    modifier: 1,
                });
                break;
        }

        if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

        return result;
    }


    async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
        const { _id } = input;
        const result = await this.commentModel.findOneAndUpdate(
            {
                _id: _id,
                memberId,
            },
            {
                commentStatus: CommentStatus.ACTIVE,
                ...input,
            },
            { new: true },
        );
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        return result;
    }

    public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
        const { commentRefId } = input.search ?? {};
        const match: T = { commentRefId, commentStatus: CommentStatus.ACTIVE };
        const sort: T = { [input.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
        const limit = input.limit ?? 10;
        const skip = ((input.page ?? 1) - 1) * limit;

        const result: Comments[] = await this.commentModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'members',
                                localField: 'memberId',
                                foreignField: '_id',
                                as: 'member',
                            },
                        },
                        { $unwind: '$member' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ]);

        if (!result || result.length === 0) {
            throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        }

        const data = result[0];

        const total = data?.metaCounter?.[0]?.total ?? 0;

        return {
            ...data,
            metaCounter: [{ total }],
        };
    }


}
