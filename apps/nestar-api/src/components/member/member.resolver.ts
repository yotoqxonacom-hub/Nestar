import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';


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
    @Mutation(() => String)
    public async updateMember(@AuthMember("_id") memberId: ObjectId): Promise<string> {
        console.log("mutation updateMember")
        console.log(typeof memberId);
        console.log(memberId);

        return this.memberService.updateMember();
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("mutation memberNick");
        console.log("memberNick:", memberNick);


        return `hi ${memberNick}`;
    }



    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("query: getMember")
        return this.memberService.getMember();
    }

    /** ADMIN **/
    // Authorization: ADMIN
    @Mutation(() => String)
    async getAllMembersByAdmin(): Promise<string> {
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
