import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AgebtsInquiry, LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/memberUpdate';
import { T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewInput } from '../view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum (1)';

@Injectable()
export class MemberService {

    constructor(@InjectModel("Member") private readonly memberModel: Model<Member>,
        private authService: AuthService,
        private viewService: ViewService,) { }

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
            }
        }
        return targetMember;
    }

    public async getAgents(memberId: ObjectId, input: AgebtsInquiry): Promise<Members> {
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


    public async getAllMembersByAdmin(): Promise<string> {
        return "getAllMembersByAdmin executed";
    }

    public async updateMemberByAdmin(): Promise<string> {
        return "updateMemberByAdmin executed";
    }

}
