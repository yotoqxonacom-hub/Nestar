import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { PropertyLocation, PropertyType } from '../../enums/property.enum (1)';
import * as mongoose from 'mongoose';
import { availablePropertySorts } from '../../config';
import { Direction } from '../../enums/common.enum';

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

	memberId?: mongoose.ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}


@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number | undefined;

	@Field(() => Int)
	end: number | undefined;
}

@InputType()
export class SquaresRange {
	@Field(() => Int)
	start: number | undefined;

	@Field(() => Int)
	end: number | undefined;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date | undefined;

	@Field(() => Date)
	end: Date | undefined;
}


@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId!: mongoose.ObjectId;

	@IsOptional()
	@Field(() => [PropertyLocation], { nullable: true })
	locationList?: PropertyLocation[];

	@IsOptional()
	@Field(() => [PropertyType], { nullable: true })
	typeList?: PropertyType[];

	@IsOptional()
	@Field(() => Int, { nullable: true })
	roomsList?: Number[];

	@IsOptional()
	@Field(() => Int, { nullable: true })
	bedsList?: Number[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => SquaresRange, { nullable: true })
	squaresRange?: SquaresRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}



@InputType()
export class PropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number | undefined;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number | undefined;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch | undefined;
}


