import './shared/styles/styles.scss';

import { API_URL, CDN_URL, cloneTemplate, ensureElement } from './shared';
import { Methods, AppState, AppUpdateEvent } from '../src/entities/Catalog';
import { EventEmitter } from './shared/utils/events';
import { Catalog } from './pages/Catalog';
import { Modal } from './shared/ui/Modal/Modal';
import { Form } from './shared/ui/Form/Form';
import { ProductCard } from './pages/Catalog/ui/ProductCard/ProductCard';
import { IOrderForm, IProductItem, IOrderContacts } from './types';
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

const appData = new AppState({}, events); // Используем AppState

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderFormAddress(
    cloneTemplate(orderAddressTemplate),
    events
);
const orderContacts = new Form<IOrderContacts>(
<<<<<<< HEAD
	cloneTemplate(orderContactsTemplate),
	events
=======
    cloneTemplate(orderContactsTemplate),
    events
>>>>>>> 972fcdf85f43fc04c961635b7b32493b4a4718c1
);

// Обновление каталога
events.on<AppUpdateEvent>('catalog:updated', () => {
    page.items = appData.shoppingCart.map((item) => {
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

// Выбор карточки товара
events.on('card:select', (item: IProductItem) => {
    appData.previewItem(item); // Используем previewItem
});

// Обновление превью
events.on('preview:updated', (item: IProductItem) => {
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

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render({
            total: appData.calculateTotalPrice(), // Используем calculateTotalPrice
        }),
    });
});

// Добавление товара в корзину
events.on('basket:addItem', (item: IProductItem) => {
    appData.addItemToCart(item); // Используем addItemToCart
    events.emit('preview:updated', item); // Используем preview:updated
    modal.close();
});

// Удаление товара из корзины
events.on('basket:removeItem', (item: IProductItem) => {
    appData.removeItemFromCart(item); // Используем removeItemFromCart
});

// Обновление корзины
events.on('cart:updated', () => {
    basket.items = appData.shoppingCart.map((item, index) => {
        const card = new ProductCard('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:removeItem', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            basketIndex: index + 1,
        });
    });

    basket.total = appData.calculateTotalPrice(); // Используем calculateTotalPrice
    page.itemCount = appData.getItemCountInCart(); // Используем itemCount
});

// Открытие формы заказа
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

// Отправка заказа
events.on('order:submit', () => {
    appData.currentOrder.items = appData.shoppingCart
        .filter((item) => item.price !== null)
        .map((item) => item.id);
    appData.currentOrder.total = appData.calculateTotalPrice(); // Используем calculateTotalPrice
    modal.render({
        content: orderContacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

// Обработка отправки контактной информации
events.on('contacts:submit', () => {
    larekApi.createOrder(appData.currentOrder).then(() => {
        const successModal = new Success(cloneTemplate(successModalTemplate), {
            onClick: () => modal.close(),
        });
        modal.render({
            content: successModal.render({
                total: appData.calculateTotalPrice(), // Используем calculateTotalPrice
            }),
        });
        appData.clearShoppingCart(); // Используем clearShoppingCart
        appData.resetCurrentOrder(); // Используем resetCurrentOrder
        basket.items = [];
        page.itemCount = 0; // Обновляем счетчик
    });
});

// Обработка ошибок формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone, address, payment } = errors;
    orderAddress.valid = !address && !payment;
    orderContacts.valid = !email && !phone;
    orderAddress.errors = Object.values({ address, payment })
        .filter((i) => !!i)
        .join('; ');
    orderContacts.errors = Object.values({ email, phone })
        .filter((i) => !!i)
        .join('; ');
});

// Обработка изменений в полях заказа
events.on(
    /^order\..*:change/,
    (data: { field: keyof IOrderForm; value: string }) => {
        appData.updateOrderField(data.field, data.value); // Используем updateOrderField
    }
);
events.on(
    /^contacts\..*:change/,
    (data: { field: keyof IOrderForm; value: string }) => {
        appData.updateOrderField(data.field, data.value); // Используем updateOrderField
    }
);

// Открытие и закрытие модального окна
events.on('modal:open', () => {
    page.isLocked =     true;
	});
	
	events.on('modal:close', () => {
			page.isLocked = false;
	});
	
	// Загрузка всех продуктов
	larekApi
			.getAllProducts()
			.then(appData.updateCatalog.bind(appData)) // Используем updateCatalog
			.catch((err) => {
					console.error(err);
			});