import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from '../types';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

export class AppState extends Model<IAppState> {
	basket: IProductItem[] = [];
	catalog: IProductItem[] = [];
	order: IOrder = this.createEmptyOrder();
	preview: string;
	formErrors: FormErrors = {};

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getTotalBasketPrice(): number {
		return this.basket.reduce((total, product) => total + product.price, 0);
	}

	getBasketItemsCount(): number {
		return this.basket.length;
	}

	addToBasket(item: IProductItem) {
		if (!this.basket.find(product => product.id === item.id)) {
			this.basket.push({ ...item, inBasket: true });
			this.emitChanges('basket:changed', { basket: this.basket });
		}
	}

	removeFromBasket(item: IProductItem) {
		this.basket = this.basket.filter(product => product.id !== item.id);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		const isValid = this.validateOrder();
		if (isValid) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(): boolean {
		const errors: FormErrors = {};
		const requiredFields: (keyof IOrderForm)[] = ['payment', 'address', 'email', 'phone'];

		requiredFields.forEach(field => {
			if (!this.order[field]) {
				errors[field] = `Необходимо указать ${field === 'address' ? 'адрес' : field}`;
			}
		});

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket.forEach(item => (item.inBasket = false));
		this.basket = [];
	}

	resetOrder() {
		this.order = this.createEmptyOrder();
	}

	private createEmptyOrder(): IOrder {
		return {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}
}
