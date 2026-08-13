import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';

@Injectable()
export class MemberService {

    constructor(@InjectModel("Member") private readonly memberModel: Model<null>) { }

    public async signup(input: MemberInput): Promise<string> {
        return "signup executed";
    }

    public async login(input: LoginInput): Promise<string> {
        return "login executed";
    }


    public async updateMember(): Promise<string> {
        return "updateMember executed";
    }

    public async getMember(): Promise<string> {
        return "getMember executed";
    }

}
