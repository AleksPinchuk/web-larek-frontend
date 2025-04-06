import './shared/styles/styles.scss';

import { API_URL, CDN_URL, cloneTemplate, ensureElement } from './shared';
import { Methods, CatalogState, BasketState, OrderState, CatalogChangeEvent, IBasketItem } from './entities/Catalog';
import { EventEmitter } from './shared/utils/events';
import { Catalog } from './pages/Catalog';
import { Modal } from './shared/ui/Modal/Modal';
import { Form } from './shared/ui/Form/Form';
import { ProductCard } from './pages/Catalog/ui/ProductCard/ProductCard';
import { IOrderForm, IProductItem, IOrderContacts, IOrderData } from './types';
import { Basket } from './widgets/Basket/Basket';
import { OrderFormAddress } from './widgets/OrderFormAddress/OrderFormAddress';
import { Success } from './widgets/Success/Success';

const events = new EventEmitter();
const larekApi = new Methods(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Catalog(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const catalogState = new CatalogState({ catalog: [] }, events);
const basketState = new BasketState({ basket: [] }, events);
const orderState = new OrderState({ order: {
	payment: '',
	address: '',
	email: '',
	phone: '',
} }, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderFormAddress(
	cloneTemplate(orderAddressTemplate),
	events
);
const orderContacts = new Form<IOrderContacts>(
	cloneTemplate(orderContactsTemplate),
	events
);
const successModal = new Success(cloneTemplate(successModalTemplate), {
	onClick: () => modal.close(),
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = catalogState.catalog.map((item) => {
		const card = new ProductCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			inBasket: item.inBasket,
		});
	});
});

events.on('card:select', (item: IProductItem) => {
	catalogState.setPreview(item);
});

events.on('preview:changed', (item: IProductItem) => {
	const card = new ProductCard(
		'card',
		cloneTemplate(cardPreviewTemplate),
		{
			onClick: () => events.emit('basket:addItem', item),
		},
		item.inBasket
	);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		}),
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			total: basketState.getTotalBasketPrice(),
		}),
	});
});

events.on('basket:addItem', (item: IProductItem) => {
	basketState.addToBasket(item);
	events.emit('preview:changed', item);
	modal.close();
});

events.on('basket:removeItem', (item: IBasketItem) => {
	basketState.removeFromBasket(item);
});

events.on('basket:changed', () => {
	basket.items = basketState.basket.map((item, index) => {
		const card = new ProductCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:removeItem', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			basketIndex: index + 1,
		});
	});

	basket.total = basketState.getTotalBasketPrice();
	page.counter = basketState.getBasketItemsCount();
});

events.on('order:open', () => {
	modal.render({
		content: orderAddress.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	// Создаем объект заказа непосредственно перед отправкой
	const orderData: IOrderData = {
		...orderState.order,
		items: basketState.basket.map(item => item.id),
		total: basketState.getTotalBasketPrice()
	};

	larekApi.createOrder(orderData)
		.then(() => {
			modal.render({
				content: successModal.render({
					total: basketState.getTotalBasketPrice(),
				}),
			});
			basketState.clearBasket();
			orderState.resetOrder();
			basket.items = [];
			page.counter = 0;

			orderAddress.render({
				payment: '',
				address: '',
				valid: false,
				errors: []
			});
			orderContacts.render({
				email: '',
				phone: '',
				valid: false,
				errors: []
			});
		})
		.catch((error) => {
			orderContacts.errors = typeof error === 'string' ? error : 'Произошла ошибка при создании заказа';
			orderContacts.valid = false;
		});
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	
	// Проверяем валидность формы адреса
	const isAddressFormValid = !address && !payment;
	orderAddress.valid = isAddressFormValid;
	orderAddress.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');

	// Проверяем валидность формы контактов
	const isContactsFormValid = !email && !phone;
	orderContacts.valid = isContactsFormValid;
	orderContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderState.setOrderField(data.field, data.value);
	}
);
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderState.setOrderField(data.field, data.value);
	}
);

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

larekApi
	.getAllProducts()
	.then(catalogState.setCatalog.bind(catalogState))
	.catch((error) => {
		const errorMessage = typeof error === 'string' ? error : 'Произошла ошибка при загрузке каталога';
		const errorElement = document.createElement('div');
		errorElement.className = 'error';
		errorElement.textContent = errorMessage;
		page.catalog = [errorElement];
	});

