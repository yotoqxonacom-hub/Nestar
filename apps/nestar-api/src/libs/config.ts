import { ObjectId } from 'bson';

export const availableAgentsSort = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank"];
export const availableMembersSort = ["createdAt", "updatedAt", "memberLikes", "memberViews"];

export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
};
