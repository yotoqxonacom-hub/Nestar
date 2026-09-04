import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { AgentsInquiry, LoginInput, MembebrsInquiry, MemberInput } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/memberUpdate';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum (1)';
import { LikeGroup } from '../../libs/enums/like.enum (1)';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Follower, Following, MeFollowed } from '../../libs/dto/follow/follow';

@Injectable()
export class MemberService {

    constructor(
        @InjectModel("Member")
        private readonly memberModel: Model<Member>,

        @InjectModel("Follow")
        private readonly followModel: Model<Follower | Following>,

        private readonly authService: AuthService,
        private readonly viewService: ViewService,
        private readonly likeService: LikeService,
    ) { }



    public async signup(input: MemberInput): Promise<Member> {
        input.memberPassword = await this.authService.hashPassword(input.memberPassword)
        try {

            const result = await this.memberModel.create(input)
            //todo auth
            result.accessToken = await this.authService.createToken(result);
            return result as unknown as Member;
        } catch (err) {
            console.log(
                "Error on serviceModel while signup:",
                err instanceof Error ? err.message : String(err));
            throw new InternalServerErrorException(Message.USED_MEMBER_NICK_OR_PHONE);
        }

    }

    public async login(input: LoginInput): Promise<Member> {
        const { memberNick, memberPassword } = input;
        const response = await this.memberModel
            .findOne({ memberNick: memberNick })
            .select("+memberPassword") // parolni ham olish uchun
            .exec() as (Member & { memberPassword?: string }) | null;

        // Agar foydalanuvchi topilmasa yoki o‘chirilgan bo‘lsa
        if (!response || response.memberStatus === MemberStatus.DELETE) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
        }
        // Agar foydalanuvchi bloklangan bo‘lsa
        else if (response.memberStatus === MemberStatus.BLOCK) {
            throw new InternalServerErrorException(Message.BLOCKED_USER);
        }

        // Parolni solishtirish (TODO: bcrypt ishlatish tavsiya etiladi)
        const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword!)
        if (!isMatch) {
            throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        }

        response.accessToken = await this.authService.createToken(response);
        // Agar hammasi joyida bo‘lsa, foydalanuvchini qaytaramiz
        return response;
    }


    public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
        const result: Member | null = await this.memberModel
            .findOneAndUpdate(
                {
                    _id: memberId,
                    memberStatus: MemberStatus.ACTIVE,
                },
                input,
                { new: true }
            ).exec();

        if (!result)
            throw new InternalServerErrorException(Message.UPDATE_FAILED);

        result.accessToken = await this.authService.createToken(result)

        return result;
    }

    public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
        const search: T = {
            _id: targetId,
            memberStatus: {
                $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
            },
        };
        const targetMember = await this.memberModel.findOne(search).lean().exec();
        console.log("targetId:", targetId);
        if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        if (memberId) {
            const viewInput: ViewInput | null = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.MEMBER };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.memberModel.findOneAndUpdate(search, {
                    $inc: {
                        memberViews: 1
                    }
                }, { new: true }).exec();
                targetMember.memberViews = (targetMember.memberViews ?? 0) + 1;

                const likeInput: LikeInput = { memberId, likeRefId: targetId, likeGroup: LikeGroup.MEMBER };
                targetMember.meLiked = await this.likeService.checkLikeExistance(likeInput) as unknown as typeof targetMember.meLiked;

                targetMember.meFollowed = await this.checkSubscription(memberId, targetId) as unknown as typeof targetMember.meFollowed;
            }
        }
        return targetMember;
    }


    private async checkSubscription(
        followerId: ObjectId,
        followingId: ObjectId,
    ): Promise<MeFollowed[]> {
        const result = await this.followModel
            .findOne({ followingId: followingId, followerId: followerId })
            .exec();

        return result
            ? [{ followerId: followerId, followingId: followingId, myFollowing: true }]
            : [];
    }




    public async getAgents(memberId: ObjectId, input: AgentsInquiry): Promise<Members> {
        const { text } = input.search;
        const match: T = { memberType: MemberType.AGENT, memberStatus: MemberStatus.ACTIVE };
        const sort: T = { [input.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
        const limit = input.limit ?? 10;


        if (text) match.memberNick = { $regex: new RegExp(text, "i") };
        console.log("match:", match);

        const result = await this.memberModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: ((input.page ?? 1) - 1) * limit },
                        { $limit: limit }
                    ],
                    metaCounter: [
                        { $count: 'total' }
                    ],
                }


            }

        ])
        console.log("result:", result);
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);


        return result[0];
    }

    public async likeTargetMember(
        memberId: ObjectId,
        likeRefId: ObjectId,
    ): Promise<Member> {

        const target = await this.memberModel.findOne({
            _id: likeRefId,
            memberStatus: MemberStatus.ACTIVE,
        });

        if (!target) {
            throw new InternalServerErrorException('NO_DATA_FOUND');
        }

        const input: LikeInput = {
            memberId,
            likeRefId,
            likeGroup: LikeGroup.MEMBER,
        };

        const modifier: number = await this.likeService.toggleLike(input);

        const result = await this.memberStatsEditor({
            _id: likeRefId,
            targetKey: 'memberLikes',
            modifier,
        });

        if (!result) {
            throw new InternalServerErrorException('SOMETHING_WENT_WRONG');
        }

        return result;
    }



    /** ADMIN */

    public async getAllMembersByAdmin(input: MembebrsInquiry): Promise<Members> {
        const { memberStatus, memberType, text } = input.search;
        const match: T = {};
        const sort: T = { [input.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
        const limit = input.limit ?? 10;

        if (memberStatus) match.memberStatus = memberStatus;
        if (memberType) match.memberType = memberType;
        if (text) match.memberNick = { $regex: new RegExp(text, "i") };
        console.log("match:", match);

        const result = await this.memberModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: ((input.page ?? 1) - 1) * limit },
                        { $limit: limit }
                    ],
                    metaCounter: [
                        { $count: 'total' }
                    ],
                }


            }

        ])
        console.log("result:", result);
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);


        return result[0];
    }

    public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
        const result: Member | null = await this.memberModel
            .findOneAndUpdate({ _id: input._id }, input, { new: true })
            .exec();

        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        return result;
    }

    public async memberStatsEditor(input: StatisticModifier): Promise<Member | null> {
        console.log('executed');
        const { _id, targetKey, modifier } = input;
        return await this.memberModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
    }


}
