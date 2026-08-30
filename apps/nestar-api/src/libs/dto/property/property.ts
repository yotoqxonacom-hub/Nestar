import { Field, Int, ObjectType } from '@nestjs/graphql';
import { type ObjectId } from 'mongoose';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum (1)';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Property {
	@Field(() => String)
	_id: ObjectId | undefined;

	@Field(() => PropertyType)
	propertyType: PropertyType | undefined;

	@Field(() => PropertyStatus)
	propertyStatus: PropertyStatus | undefined;

	@Field(() => PropertyLocation)
	propertyLocation: PropertyLocation | undefined;

	@Field(() => String)
	propertyAddress: string | undefined;

	@Field(() => String)
	propertyTitle: string | undefined;

	@Field(() => Number)
	propertyPrice: number | undefined;

	@Field(() => Number)
	propertySquare: number | undefined;

	@Field(() => Int)
	propertyBeds: number | undefined;

	@Field(() => Int)
	propertyRooms: number | undefined;

	@Field(() => Int)
	propertyViews: number | undefined;

	@Field(() => Int)
	propertyLikes: number | undefined;

	@Field(() => Int)
	propertyComments: number | undefined;

	@Field(() => Int)
	propertyRank: number | undefined;

	@Field(() => [String])
	propertyImages: string[] | undefined;

	@Field(() => String, { nullable: true })
	propertyDesc?: string;

	@Field(() => Boolean)
	propertyBarter: boolean | undefined;

	@Field(() => Boolean)
	propertyRent: boolean | undefined;

	@Field(() => String)
	memberId: ObjectId | undefined;


	soldAt?: Date;

	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date | undefined;

	@Field(() => Date)
	updatedAt: Date | undefined;


	/** from aggrigation**/
	@Field(() => Member, { nullable: true })
	memberData?: Member
}

@ObjectType()
export class Properties {
	@Field(() => [Property])
	list: Property[] | undefined;

	@Field(() => TotalCounter, { nullable: true })
	metaCounter: TotalCounter[] | undefined;
}


