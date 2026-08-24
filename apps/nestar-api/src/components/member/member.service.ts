import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/memberUpdate';

@Injectable()
export class MemberService {

    constructor(@InjectModel("Member") private readonly memberModel: Model<Member>,
        private authService: AuthService,) { }

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

    public async getMember(): Promise<string> {
        return "getMember executed";
    }


    public async getAllMembersByAdmin(): Promise<string> {
        return "getAllMembersByAdmin executed";
    }

    public async updateMemberByAdmin(): Promise<string> {
        return "updateMemberByAdmin executed";
    }

}
