import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class LikeService {
    constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) { }

    public async toggleLike(input: LikeInput): Promise<number> {
        const search: T = {
            memberId: input.memberId,
            likeRefId: input.likeRefId,
        };

        const exist = await this.likeModel.findOne(search).exec();

        console.log("========== TOGGLE LIKE ==========");
        console.log("memberId:", input.memberId);
        console.log("likeRefId:", input.likeRefId);
        console.log("exist:", exist);

        let modifier = 1;

        if (exist) {
            console.log("LIKE BOR → DELETE → -1");

            await this.likeModel.findOneAndDelete(search).exec();

            modifier = -1;
        } else {
            console.log("LIKE YO'Q → CREATE → +1");

            await this.likeModel.create(input);

            modifier = 1;
        }

        console.log("modifier:", modifier);

        return modifier;
    }

    public async checkLikeExistance(input: LikeInput): Promise<MeLiked[]> {
        const { memberId, likeRefId } = input;
        const result = await this.likeModel.findOne({ memberId, likeRefId }).exec();
        return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
    }


}
