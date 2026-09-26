import { MemberAuthType, MemberStatus, MemberType } from '../enums/member.enum';

export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberPhone: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberProducts: number;
	memberOrders: number;
	memberArticles: number;
	memberFollowers: number;
	memberFollowings: number;
	memberPoints: number;
	memberLikes: number;
	memberViews: number;
	memberComments: number;
	memberRank: number;
	memberWarnings: number;
	memberBlocks: number;
	createdAt: string;
	updatedAt: string;
	accessToken?: string;
}

export interface TotalCounter {
	total: number;
}

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}
