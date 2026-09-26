import { OrderStatus, PaymentType } from '../enums/order.enum';
import { Product } from './product';

export interface OrderItem {
	_id: string;
	itemQuantity: number;
	itemPrice: number;
	orderId: string;
	productId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	_id: string;
	orderStatus: OrderStatus;
	paymentType: PaymentType;
	orderTotal: number;
	orderDelivery: number;
	orderAddress: string;
	orderPhone: string;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	/** from aggregation **/
	orderItems: OrderItem[];
	productData: Product[];
}

export interface CartItem {
	productId: string;
	quantity: number;
}
