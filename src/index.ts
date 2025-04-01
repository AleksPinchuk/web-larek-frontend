import './shared/styles/styles.scss';

import { API_URL, CDN_URL, cloneTemplate, ensureElement } from './shared';
import { Methods, CatalogState, CatalogChangeEvent } from './entities/Catalog';
import { EventEmitter } from './shared/utils/events';
import { Catalog } from './pages/Catalog';
import { Modal } from './shared/ui/Modal/Modal';
import { ProductCard } from './pages/Catalog/ui/ProductCard/ProductCard';
import { IProduct } from './types';
import { ShoppingCart } from './widgets/Basket/Basket';
import { AddressForm } from './widgets/OrderFormAddress/OrderFormAddress';
import { OrderFormContacts } from './widgets/OrderFormContacts/OrderFormContacts';
import { OrderSuccessMessage } from './widgets/Success/Success';

const events = new EventEmitter();
const larekApi = new Methods(CDN_URL, API_URL);

const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    orderAddress: ensureElement<HTMLTemplateElement>('#order'),
    orderContacts: ensureElement<HTMLTemplateElement>('#contacts'),
    successModal: ensureElement<HTMLTemplateElement>('#success'),
};

const page = new Catalog(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const appData = new CatalogState({}, events);
const basket = new ShoppingCart(cloneTemplate(templates.basket), events);
const orderAddress = new AddressForm(cloneTemplate(templates.orderAddress), events);
const orderContacts = new OrderFormContacts(cloneTemplate(templates.orderContacts), events);

// Функция рендера карточек
const renderProductCard = (item: IProduct) => {
    const cardElement = cloneTemplate(templates.cardCatalog);
    if (!(cardElement instanceof HTMLElement)) {
        throw new Error('cloneTemplate не вернул HTMLElement');
    }
    const card = new ProductCard(cardElement, 'card', {
        onClick: () => events.emit('card:select', item),
    });
    return card.render(item);
};

// Обновление каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    console.log('Каталог обновляется');
    page.itemsList = appData.getCatalog().map(renderProductCard);
});

// Выбор товара
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
    events.emit('preview:changed', item);
});

// Обновление предпросмотра
events.on('preview:changed', (item: IProduct) => {
    console.log('Предпросмотр обновляется', item);
    const cardElement = cloneTemplate(templates.cardPreview);
    if (!(cardElement instanceof HTMLElement)) {
        throw new Error('cloneTemplate не вернул HTMLElement');
    }
    const card = new ProductCard(cardElement, 'card', {
        onClick: () => events.emit('basket:addItem', item),
    });
    modal.render({
        content: card.render(item),
    });
});

// Открытие корзины
events.on('basket:open', () => {
    console.log('Корзина открывается');
    modal.render({
        content: basket.render({
            products: appData.getBasket(),
            totalAmount: appData.getTotalBasketPrice(),
        }),
    });
});

// Добавление товара в корзину
events.on('basket:addItem', (item: IProduct) => {
    console.log('Добавление в корзину', item);
    appData.addToBasket(item);
    events.emit('basket:changed');
    events.emit('preview:changed', item);
});

// Обновление корзины
events.on('basket:changed', () => {
    console.log('Корзина обновляется', appData.getBasket());
    basket.setProducts(appData.getBasket());
    basket.totalAmount = appData.getTotalBasketPrice();
    page.itemCount = appData.getBasketItemsCount();
});

// Открытие формы заказа
events.on('order:open', () => {
    modal.render({
        content: orderAddress.render({
            paymentMethod: 'card',
            isValid: false,
            errorMessages: [],
        }),
    });
});

// Получение товаров
larekApi
    .getAllProducts()
    .then((products) => {
        console.log('Товары загружены', products);
        appData.setCatalog(products);
    })
    .catch((err) => {
        console.error('Ошибка загрузки каталога:', err);
    });
