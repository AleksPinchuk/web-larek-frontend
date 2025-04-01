import {
	IFormValidationErrors,
	IApplicationState,
	IOrder,
	IProduct,
} from '../../types';
import { Model } from '../../shared/utils/model';

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class CatalogState extends Model<IApplicationState> {
	basket: IProduct[] = [];
	catalog: IProduct[] = [];
	order: IOrder = {
		paymentMethod: '',
		deliveryAddress: '',
		email: '',
		phoneNumber: '',
		productIds: [],
		totalCost: 0,
	};
	preview: string;
	formErrors: IFormValidationErrors = {}; // Теперь может содержать строковые ошибки

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getCatalog() {
		return this.catalog; // возвращаем каталог
	}

	getBasket(): IProduct[] {
		return this.basket;
	}

	getTotalBasketPrice(): number {
		return this.basket.reduce((total, product) => total + product.cost, 0);
	}

	getBasketItemsCount(): number {
		return this.basket.length;
	}

	addToBasket(item: IProduct) {
		const product = this.catalog.find((product) => product.id === item.id);
		if (product) {
			this.basket = [...this.basket, product];
			item.isInBasket = true;
			this.emitChanges('basket:changed', { basket: this.basket });
		}
	}

	removeFromBasket(item: IProduct) {
		this.basket = this.basket.filter((product) => product.id !== item.id);
		item.isInBasket = false;
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrder, value: string) {
		(this.order[field] as string) = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.paymentMethod) {
			errors.paymentMethod = 'Необходимо указать способ оплаты';
		}
		if (!this.order.deliveryAddress) {
			errors.deliveryAddress = 'Необходимо указать адрес';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phoneNumber) {
			errors.phoneNumber = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket.forEach((item) => (item.isInBasket = false));
		this.basket = [];
	}

	resetOrder() {
		this.order = {
			paymentMethod: '',
			deliveryAddress: '',
			email: '',
			phoneNumber: '',
			productIds: [],
			totalCost: 0,
		};
	}
}
