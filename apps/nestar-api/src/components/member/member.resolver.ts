import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator (2)';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard (1)';
import { log } from 'console';
import { MemberUpdate } from '../../libs/dto/memberUpdate';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) { }

    @Mutation(() => Member)
    public async signup(
        @Args("input") input: MemberInput
    ): Promise<Member> {
        console.log("mutation: signup");
        console.log("input:", input);
        return this.memberService.signup(input);
    }


    @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput): Promise<Member> {
        console.log("mutation: login")
        return this.memberService.login(input);
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("mutation memberNick");
        console.log("memberNick:", memberNick);


        return `hi ${memberNick}`;
    }


    @Roles(MemberType.USER)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        console.log(" query: checkAuthRoles");
        console.log("mutation memberNick");
        console.log("member:", authMember);


        return `hi ${authMember.memberNick},
         you are ${authMember.memberType},
          (memberId ${authMember._id})`;
    }


    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(@Args("input") input: MemberUpdate, @AuthMember("_id") memberId: ObjectId): Promise<Member> {
        console.log("mutation updateMember")
        delete (input as Partial<MemberUpdate>)._id;
        return this.memberService.updateMember(memberId, input);
    }



    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("query: getMember")
        return this.memberService.getMember();
    }

    /** ADMIN **/
    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    async getAllMembersByAdmin(@AuthMember() authMember: Member): Promise<string> {
        console.log("authMember:", authMember.memberType);
        // Bu yerda barcha a'zolarni admin orqali olish logikasi bo'ladi
        return this.memberService.getAllMembersByAdmin();
    }

    // Authorization: ADMIN
    @Mutation(() => String)
    async updateMemberByAdmin(): Promise<string> {
        console.log("Mutation: updateMemberByAdmin");
        // Bu yerda a'zoni admin tomonidan yangilash logikasi bo'ladi
        return this.memberService.updateMemberByAdmin();
    }



}
