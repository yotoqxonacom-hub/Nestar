import { BadRequestException, Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AgentPropertiesInquiry, AllPropertiesInquiry, PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { Properties, Property } from '../../libs/dto/property/property';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { PropertyStatus } from '../../libs/enums/property.enum (1)';
import { ViewGroup } from '../../libs/enums/view.enum (1)';
import { ViewService } from '../view/view.service';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import moment from 'moment';
import { WithoutGuard } from '../auth/guards/without.guard (1)';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeGroup } from '../../libs/enums/like.enum (1)';
import { ObjectId } from 'mongoose';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: mongoose.Model<Property>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) { }

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);
			// increase memberProperties
			if (result.memberId) {
				await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });
			}
			return result;
		} catch (err) {
			console.log('Error, Service.model:', (err as Error).message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProperty(memberId: mongoose.ObjectId, propertyId: mongoose.ObjectId): Promise<Property> {
		const search: T = {
			_id: propertyId,
			propertyStatus: PropertyStatus.ACTIVE,
		};

		const targetProperty = (await this.propertyModel.findOne(search).lean().exec()) as Property | null;
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
				targetProperty.propertyViews = (targetProperty.propertyViews ?? 0) + 1;
			}

			const likeInput: LikeInput = { memberId, likeRefId: propertyId, likeGroup: LikeGroup.PROPERTY };
			targetProperty.meLiked = await this.likeService.checkLikeExistance(likeInput) as unknown as typeof targetProperty.meLiked;

		}

		if (targetProperty.memberId) {
			targetProperty.memberData = await this.memberService.getMember(null as any, targetProperty.memberId);
		}
		return targetProperty;
	}

	public async propertyStatsEditor(input: StatisticModifier): Promise<Property | null> {
		const { _id, targetKey, modifier } = input;
		return (await this.propertyModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{ new: true },
			)
			.exec()) as Property | null;
	}

	public async updateProperty(memberId: mongoose.ObjectId, input: PropertyUpdate): Promise<Property> {
		let { propertyStatus, soldAt, deletedAt } = input
		const search: T = {
			_id: input._id,
			memberId: memberId,
			propertyStatus: PropertyStatus.ACTIVE,
		};

		if (input.propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();

		else if (input.propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();


		const result = await this.propertyModel
			.findOneAndUpdate(search, input, { new: true })
			.lean()
			.exec();

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (input.propertyStatus === PropertyStatus.SOLD || input.propertyStatus === PropertyStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId as unknown as mongoose.ObjectId,
				targetKey: 'memberProperties',
				modifier: -1,
			});
		}

		return result;
	}


	public async getProperties(
		memberId: mongoose.ObjectId,
		input: PropertiesInquiry,
	): Promise<Properties> {
		const match: any = {};
		if (input.search?.propertyStatus) {
			match.propertyStatus = input?.search.propertyStatus;
		} else {
			match.propertyStatus = { $in: [PropertyStatus.ACTIVE, PropertyStatus.SOLD] };
		}

		const sort = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log(match);

		const page = input?.page ?? 1;
		const limit = input?.limit ?? 10;

		const result = await this.propertyModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result || result.length === 0) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		const data = result[0];
		const total = data.metaCounter[0]?.total ?? 0;

		return {
			...data,
			metaCounter: { total },
		};
	}



	private shapeMatchQuery<T>(match: T, input: PropertiesInquiry): void {
		const {
			memberId,
			locationList,
			roomsList,
			bedsList,
			typeList,
			pricesRange,
			periodsRange,
			squaresRange,
			options,
			text,
		} = input.search ?? {};

		if (memberId) match['memberId'] = shapeIntoMongoObjectId(memberId);
		if (locationList) match['propertyLocation'] = { $in: locationList };
		if (roomsList) match['propertyRooms'] = { $in: roomsList };
		if (bedsList) match['propertyBeds'] = { $in: bedsList };
		if (typeList) match['propertyType'] = { $in: typeList };
		if (pricesRange) match['propertyPrice'] = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (periodsRange) match['createdAt'] = { $gte: periodsRange.start, $lte: periodsRange.end };
		if (squaresRange) match['propertySquare'] = { $gte: squaresRange.start, $lte: squaresRange.end };
		if (options) match['$or'] = options.map(option => ({ [option]: true }));
		if (text) match['propertyTitle'] = { $regex: text, $options: 'i' };
	}


	public async getAgentProperties(
		memberId: mongoose.ObjectId,
		input: AgentPropertiesInquiry,
	): Promise<Properties> {
		if (input.propertyStatus === PropertyStatus.DELETE) {
			throw new BadRequestException('Property status cannot be DELETE');
		}

		const match: any = { memberId };

		if (input.search?.propertyStatus) {
			match.propertyStatus = input.search.propertyStatus;
		} else {
			match.propertyStatus = { $in: [PropertyStatus.ACTIVE, PropertyStatus.SOLD] };
		}

		const sort = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
		const page = input?.page ?? 1;
		const limit = input?.limit ?? 10;

		const result = await this.propertyModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result || result.length === 0) {
			throw new InternalServerErrorException('NO_DATA_FOUND');
		}

		const data = result[0];
		const total = data.metaCounter[0]?.total ?? 0;

		return {
			...data,
			metaCounter: { total },
		};
	}



	public async likeTargetProperty(
		memberId: mongoose.ObjectId,
		likeRefId: mongoose.ObjectId,
	): Promise<Property> {

		const target = await this.propertyModel.findOne({
			_id: likeRefId,
			propertyStatus: PropertyStatus.ACTIVE,
		});

		if (!target) {
			throw new InternalServerErrorException('NO_DATA_FOUND');
		}

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.PROPERTY,
		};

		const modifier: number = await this.likeService.toggleLike(input);

		const result = await this.propertyStatsEditor({
			_id: likeRefId,
			targetKey: 'propertyLikes',
			modifier,
		});

		if (!result) {
			throw new InternalServerErrorException('SOMETHING_WENT_WRONG');
		}

		return result;
	}



	/** ADMIN **/


	public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties[]> {
		const { propertyStatus, propertyLocationList } = input?.search ?? {};
		const match: any = {};
		const sort: any = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (propertyStatus) match.propertyStatus = propertyStatus;
		if (propertyLocationList) match.propertyLocation = { $in: propertyLocationList };

		const result = await this.propertyModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: ((input?.page ?? 1) - 1) * (input?.limit ?? 10) },
							{ $limit: input?.limit ?? 10 },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const data = result[0];
		const total = data.metaCounter[0]?.total ?? 0;

		return {
			...data,
			metaCounter: { total },
		};
	}

	public async updatePropertyByAdmin(input: PropertyUpdate): Promise<Property> {
		let { propertyStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			propertyStatus: PropertyStatus.ACTIVE,
		};

		if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
		else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.propertyModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			if (result.memberId) {
				await this.memberService.memberStatsEditor({
					_id: result.memberId,
					targetKey: 'memberProperties',
					modifier: -1,
				});
			}
		}

		return result;
	}


	public async removePropertyByAdmin(propertyId: mongoose.ObjectId): Promise<Property> {
		const search = { _id: propertyId, propertyStatus: PropertyStatus.DELETE };
		const result = await this.propertyModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}


}
