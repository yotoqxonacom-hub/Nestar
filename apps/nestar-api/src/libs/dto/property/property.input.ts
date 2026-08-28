import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { PropertyLocation, PropertyType } from '../../enums/property.enum (1)';
import { ObjectId } from 'mongoose';

@InputType()
export class PropertyInput {
	@IsNotEmpty()
	@Field(() => PropertyType)
	propertyType: PropertyType | undefined;

	@IsNotEmpty()
	@Field(() => PropertyLocation)
	propertyLocation: PropertyLocation | undefined;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	propertyAddress: string | undefined;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	propertyTitle: string | undefined;

	@IsNotEmpty()
	@Field(() => Number)
	propertyPrice: number | undefined;

	@IsNotEmpty()
	@Field(() => Number)
	propertySquare: number | undefined;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	propertyBeds: number | undefined;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	propertyRooms: number | undefined;

	@IsNotEmpty()
	@Field(() => [String])
	propertyImages: string[] | undefined;

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	propertyDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	propertyBarter?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	propertyRent?: boolean;

	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
