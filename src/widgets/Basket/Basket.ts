import { Component } from '../../shared/ui/Component/Component';
import { createElement, ensureElement } from '../../shared/utils/utils';
import { EventEmitter } from '../../shared/utils/events';
import { IProduct } from '../../types'; // использование IProduct

interface BasketViewData {
	products: IProduct[];
	totalAmount: number;
}

export class ShoppingCart extends Component<BasketViewData> {
	private productList: HTMLElement;
	private totalPriceDisplay: HTMLElement;
	private checkoutButton: HTMLButtonElement;
	private _products: IProduct[] = []; // Хранит список товаров

	constructor(container: HTMLElement, protected eventBus: EventEmitter) {
		super(container);

		this.productList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalPriceDisplay = this.container.querySelector('.basket__price');
		this.checkoutButton = this.container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		this.setButtonState(this.checkoutButton, true);

		if (this.checkoutButton) {
			this.checkoutButton.addEventListener('click', () => {
				eventBus.emit('order:start');
			});
		}
	}

	/** Геттер для получения списка товаров */
	get products(): IProduct[] {
		return this._products;
	}

	/** Сеттер для обновления списка товаров */
	set products(items: IProduct[]) {
		this._products = items; // Обновляем хранимый список

		if (items.length > 0) {
			this.productList.replaceChildren(
				...items.map((product) => {
					const productElement = createElement<HTMLElement>('li', {
						textContent: `${product.name} - ${product.cost} синапсов`,
						className: 'basket__item',
					});
					return productElement;
				})
			);
		} else {
			this.clearItems();
		}

		this.toggleCheckoutButton(items);
	}

	/** Устанавливает список товаров и ререндерит корзину */
	setProducts(items: IProduct[]) {
		this.products = items; // Используем сеттер
		this.render();
		console.log('Текущие товары в корзине:', this._products);
	}

	/** Очищает корзину */
	clearItems() {
		this._products = [];
		this.productList.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			})
		);
		this.toggleCheckoutButton([]);
	}

	private toggleCheckoutButton(items: IProduct[]) {
		this.setButtonState(this.checkoutButton, items.length === 0);
	}

	private setButtonState(button: HTMLButtonElement, isDisabled: boolean) {
		button.disabled = isDisabled;
	}

	/** Обновляет сумму заказа */
	set totalAmount(total: number) {
		this.setText(this.totalPriceDisplay, `${total} синапсов`);
	}
}



