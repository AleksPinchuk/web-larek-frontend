import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { ProductCard } from './components/ProductCard';
import { IOrderForm, IProductItem } from './types';
import { Basket } from './components/common/Basket';
import { OrderFormAddress } from './components/OrderFormAddress';
import { OrderFormContacts } from './components/OrderFormContacts';
import { Success } from './components/Success';

// Создание и настройка экземпляра EventEmitter
const events = new EventEmitter();
// Создание экземпляра LarekApi с использованием URL-адресов
const larekApi = new LarekApi(CDN_URL, API_URL);

// Логирование всех событий для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Шаблоны для различных компонентов, с гарантией их наличия на странице
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация компонентов страницы
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация состояния приложения
const appData = new AppState({}, events);

// Инициализация корзины и форм
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderFormAddress(cloneTemplate(orderAddressTemplate), events);
const orderContacts = new OrderFormContacts(cloneTemplate(orderContactsTemplate), events);

// Обработчик изменения каталога товаров
events.on<CatalogChangeEvent>('items:changed', () => {
	// Обновление отображения товаров на странице
	page.catalog = appData.catalog.map(item => {
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

// Обработчик выбора товара
events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item); // Устанавливаем выбранный товар для просмотра
});

// Обработчик изменения предпросмотра товара
events.on('preview:changed', (item: IProductItem) => {
	const card = new ProductCard('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:addItem', item),
	}, item.inBasket);
	// Отображение модального окна с информацией о товаре
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

// Обработчик открытия корзины
events.on('basket:open', () => {
	// Отображение модального окна с корзиной
	modal.render({
		content: basket.render({
			total: appData.getTotalBasketPrice(),
		}),
	});
});

// Обработчик добавления товара в корзину
events.on('basket:addItem', (item: IProductItem) => {
	appData.addToBasket(item); // Добавляем товар в корзину
	events.emit('preview:changed', item); // Обновляем предпросмотр
});

// Обработчик удаления товара из корзины
events.on('basket:removeItem', (item: IProductItem) => {
	appData.removeFromBasket(item); // Удаляем товар из корзины
});

// Обработчик изменения состояния корзины
events.on('basket:changed', () => {
	// Обновляем отображение товаров в корзине
	basket.items = appData.basket.map((item, index) => {
		const card = new ProductCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:removeItem', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			basketIndex: index + 1,
		});
	});

	// Обновляем общую сумму корзины и количество товаров
	basket.total = appData.getTotalBasketPrice();
	page.counter = appData.getBasketItemsCount();
});

// Обработчик открытия формы для ввода адреса заказа
events.on('order:open', () => {
	// Отображение модального окна для ввода адреса
	modal.render({
		content: orderAddress.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик отправки формы с адресом
events.on('order:submit', () => {
	appData.order.items = appData.basket.filter(item => item.price !== null).map(item => item.id);
	appData.order.total = appData.getTotalBasketPrice()
	// Отображение формы для ввода контактных данных
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик отправки контактных данных
events.on('contacts:submit', () => {
	console.log(appData.order); // Логируем заказ
	// Создание заказа через API
	larekApi.createOrder(appData.order).then(res => {
		const successModal = new Success(cloneTemplate(successModalTemplate), { onClick: () => modal.close() });
		// Отображение модального окна с успешным сообщением
		modal.render({
			content: successModal.render({
				total: appData.getTotalBasketPrice(),
			}),
		});
		// Очистка корзины и сброс данных заказа
		appData.clearBasket();
		appData.resetOrder();
		basket.items = [];
		page.counter = 0;
	});
});

// Обработчик ошибок в формах
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	// Устанавливаем статус валидности форм на основе ошибок
	orderAddress.valid = !address && !payment;
	orderContacts.valid = !email && !phone;
	orderAddress.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
	orderContacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Обработчики изменения данных формы
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// Обработчики открытия и закрытия модального окна
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

// Загрузка списка товаров при старте приложения
larekApi.getAllProducts()
	.then(appData.setCatalog.bind(appData))
	.catch(err => {
		console.error(err); // Логирование ошибок
	});
