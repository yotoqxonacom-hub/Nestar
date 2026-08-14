import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class MemberService {

    constructor(@InjectModel("Member") private readonly memberModel: Model<Member>) { }

    public async signup(input: MemberInput): Promise<Member> {
        try {

            const result = await this.memberModel.create(input)
            //todo auth
            return result as unknown as Member;
        } catch (err) {
            console.log("Error on serviceModel while logining:", err)
            throw new BadRequestException(err)
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
        console.log("response:", response);
        // Parolni solishtirish (TODO: bcrypt ishlatish tavsiya etiladi)
        const isMatch = memberPassword === response.memberPassword;
        if (!isMatch) {
            throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        }

        // Agar hammasi joyida bo‘lsa, foydalanuvchini qaytaramiz
        return response;
    }


    public async updateMember(): Promise<string> {
        return "updateMember executed";
    }

    public async getMember(): Promise<string> {
        return "getMember executed";
    }

}
