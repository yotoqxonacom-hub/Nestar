import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry, Properties } from '../../libs/dto/property/property';
import { ViewGroup } from '../../libs/enums/view.enum (1)';
import { lookupFavorite, lookupVisit } from '../../libs/config';

@Injectable()
export class ViewService {
    constructor(@InjectModel("View") private readonly viewModel: Model<View>) { }

    public async recordView(input: ViewInput): Promise<View | null> {
        const viewExist = await this.checkViewExistence(input);
        if (!viewExist) {
            console.log("<===== New View Inserted =====>");
            return await this.viewModel.create(input);
        } else return null;

    }

    private async checkViewExistence(input: ViewInput): Promise<View | null> {
        const { memberId, viewRefId } = input;
        const search: T = { memberId: memberId, viewModelId: viewRefId };
        return await this.viewModel.findOne(search).exec();
    }


    public async getVisitedProperties(
        memberId: mongoose.ObjectId,
        input: OrdinaryInquiry
    ): Promise<Properties> {
        const { page, limit } = input;

        const match = {
            viewGroup: ViewGroup.PROPERTY,
            memberId: memberId,
        };

        const data = await this.viewModel
            .aggregate([
                { $match: match },
                { $sort: { updatedAt: -1 } },
                {
                    $lookup: {
                        from: 'properties',              // qaysi kolleksiyadan olish
                        localField: 'viewRefId',         // viewRefId orqali bog‘lash
                        foreignField: '_id',             // properties dagi _id bilan solishtirish
                        as: 'visitedProperty',           // natija shu nom bilan chiqadi
                    },
                },
                { $unwind: '$visitedProperty' },     // arrayni elementlarga ajratish
                {
                    $facet: {
                        list: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            lookupVisit,
                            { $unwind: '$visitedProperty.memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();

        const result: Properties = {
            list: [],
            metaCounter: data[0].metaCounter,
        };

        result.list = data[0].list.map((ele) => ele.visitedProperty);

        return result;
    }


}
