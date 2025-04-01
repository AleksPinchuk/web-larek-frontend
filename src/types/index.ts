type ClickHandler = (event: MouseEvent) => void;

interface IActionHandlers {
	handleClick: ClickHandler;
}

export interface IProduct {
	id: string;
	description: string;
	imageUrl: string;
	name: string;
	category: string;
	cost: number;
	isInBasket: boolean;
	basketPosition: number;
}

export interface IPaymentDetails {
	paymentMethod: string;
	deliveryAddress: string;
}

export interface IContactInfo {
	email: string;
	phoneNumber: string;
}

export interface IOrderDetails extends IPaymentDetails, IContactInfo {
  errors?: string[]; // Добавляем поле для ошибок
}

export interface IOrder extends IOrderDetails {
	productIds: string[];
	totalCost: number;
}

export interface IOrderResponse {
	response: { orderId: string; totalCost: number } | { errorMessage: string };
}

export type IFormValidationErrors = Record<string, string>;

export interface IApplicationState {
	productList: IProduct[];
	shoppingCart: IProduct[];
	currentOrder: IOrder | null;
	validationErrors: IFormValidationErrors;
}