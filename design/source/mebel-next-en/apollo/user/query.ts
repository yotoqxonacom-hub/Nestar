import { gql } from '@apollo/client';

/**
 * Backend (NestJS + GraphQL) tayyor bo'lganda sahifalar shu so'rovlardan foydalanadi.
 * Maydonlar docs/ER-MODEL.md dagi kolleksiyalar bilan bir xil.
 */

const PRODUCT_FIELDS = `
	_id
	productType
	productStatus
	productMaterial
	productLocation
	productName
	productColor
	productPrice
	productDiscount
	productLeftCount
	productSeats
	productWidth
	productDepth
	productHeight
	productFoldable
	productInstallment
	productImages
	productDesc
	productViews
	productLikes
	productComments
	productRank
	memberId
	createdAt
	updatedAt
	memberData {
		_id
		memberNick
		memberFullName
		memberImage
		memberPhone
	}
	meLiked {
		memberId
		likeRefId
		myFavorite
	}
`;

/** MEMBER **/
export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
				_id
				memberType
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberFollowers
				memberLikes
				memberViews
				memberRank
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
			_id
			memberType
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberArticles
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
		}
	}
`;

/** PRODUCT **/
export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
			${PRODUCT_FIELDS}
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
				${PRODUCT_FIELDS}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				${PRODUCT_FIELDS}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				${PRODUCT_FIELDS}
			}
			metaCounter {
				total
			}
		}
	}
`;

/** ORDER **/
export const GET_MY_ORDERS = gql`
	query GetMyOrders($input: OrderInquiry!) {
		getMyOrders(input: $input) {
			_id
			orderStatus
			paymentType
			orderTotal
			orderDelivery
			orderAddress
			orderPhone
			memberId
			createdAt
			updatedAt
			orderItems {
				_id
				itemQuantity
				itemPrice
				orderId
				productId
			}
			productData {
				${PRODUCT_FIELDS}
			}
		}
	}
`;

/** BOARD ARTICLE **/
export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/** COMMENT **/
export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/** FOLLOW **/
export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				followingData {
					_id
					memberNick
					memberFullName
					memberImage
					memberProducts
					memberFollowers
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
