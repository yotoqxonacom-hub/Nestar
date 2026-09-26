import { ProductLocation, ProductMaterial, ProductStatus, ProductType } from '../enums/product.enum';
import { Member, MeLiked, TotalCounter } from './member';

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productMaterial: ProductMaterial;
	productLocation: ProductLocation;
	productName: string;
	productColor: string;
	productPrice: number;
	productDiscount: number;
	productLeftCount: number;
	productSeats: number;
	productWidth: number;
	productDepth: number;
	productHeight: number;
	productFoldable: boolean;
	productInstallment: boolean;
	productImages: string[];
	productDesc?: string;
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}

export interface Range {
	start: number;
	end: number;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: 'ASC' | 'DESC';
	search: {
		memberId?: string;
		locationList?: ProductLocation[];
		typeList?: ProductType[];
		materialList?: ProductMaterial[];
		seatsList?: number[];
		options?: ('productFoldable' | 'productInstallment')[];
		pricesRange?: Range;
		text?: string;
	};
}
