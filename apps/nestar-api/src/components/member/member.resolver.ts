import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MembebrsInquiry, MemberInput } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator (2)';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard (1)';
import { log } from 'console';
import { MemberUpdate } from '../../libs/dto/memberUpdate';
import { getSerialForImage, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard (1)';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Message } from '../../libs/enums/common.enum';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) { }

    @Mutation(() => Member)
    public async signup(
        @Args("input") input: MemberInput
    ): Promise<Member> {
        console.log("mutation: signup");
        console.log("input:", input);
        return await this.memberService.signup(input);
    }


    @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput): Promise<Member> {
        console.log("mutation: login")
        return await this.memberService.login(input);
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("mutation memberNick");
        console.log("memberNick:", memberNick);


        return `hi ${memberNick}`;
    }


    @Roles(MemberType.USER, MemberType.AGENT)
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
        return await this.memberService.updateMember(memberId, input);
    }


    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(@Args("memberId") input: string, @AuthMember("_id") memberId: ObjectId): Promise<Member> {
        console.log("query: getMember")
        const targetId = shapeIntoMongoObjectId(input);
        return this.memberService.getMember(memberId, targetId);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAgents(@Args("input") input: AgentsInquiry, @AuthMember("_id") memberId: ObjectId): Promise<Members> {
        console.log("query: getAgents");
        return await this.memberService.getAgents(memberId, input);
    }



    /** ADMIN **/
    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => Members)
    async getAllMembersByAdmin(@Args("input") input: MembebrsInquiry): Promise<Members> {
        console.log("Query:getAllMembersByAdmin");
        // Bu yerda barcha a'zolarni admin orqali olish logikasi bo'ladi
        return await this.memberService.getAllMembersByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
        console.log('Mutation: updateMemberByAdmin');
        return await this.memberService.updateMemberByAdmin(input);
    }


    /** UPLOADER **/
    // IMAGE UPLOADER (member.resolver.ts)


    @UseGuards(AuthGuard)
    @Mutation((returns) => String)
    public async imageUploader(
        @Args({ name: 'file', type: () => GraphQLUpload })
        { createReadStream, filename, mimetype }: FileUpload,
        @Args('target') target: String,
    ): Promise<string> {
        console.log('Mutation: imageUploader');

        if (!filename) throw new Error(Message.UPLOAD_FAILED);
        const validMime = validMimeTypes.includes(mimetype);
        if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

        const imageName = getSerialForImage(filename);
        const url = `uploads/${target}/${imageName}`;
        const stream = createReadStream();

        const result = await new Promise((resolve, reject) => {
            stream
                .pipe(createWriteStream(url))
                .on('finish', async () => resolve(true))
                .on('error', () => reject(false));
        });
        if (!result) throw new Error(Message.UPLOAD_FAILED);

        return url;
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => [String])
    public async imagesUploader(
        @Args('files', { type: () => [GraphQLUpload] })
        files: Promise<FileUpload>[],
        @Args('target') target: String,
    ): Promise<string[]> {
        console.log('Mutation: imagesUploader');

        const uploadedImages: string[] = [];
        const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
            try {
                const { filename, mimetype, encoding, createReadStream } = await img;

                const validMime = validMimeTypes.includes(mimetype);
                if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

                const imageName = getSerialForImage(filename);
                const url = `uploads/${target}/${imageName}`;
                const stream = createReadStream();

                const result = await new Promise((resolve, reject) => {
                    stream
                        .pipe(createWriteStream(url))
                        .on('finish', () => resolve(true))
                        .on('error', () => reject(false));
                });
                if (!result) throw new Error(Message.UPLOAD_FAILED);

                uploadedImages[index] = url;
            } catch (err) {
                console.log('Error, file missing!');
            }
        });

        await Promise.all(promisedList);
        return uploadedImages;
    }


}
