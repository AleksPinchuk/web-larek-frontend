import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from '../../types';
import { Model } from '../../shared/utils/model';

export type AppUpdateEvent = {
    products: IProductItem[]
};

export class AppState extends Model<IAppState> {
    shoppingCart: IProductItem[] = [];
    productList: IProductItem[] = [];
    currentOrder: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
    selectedPreview: string;
    validationErrors: FormErrors = {};

    public updateCatalog(newItems: IProductItem[]): void {
        this.productList = newItems;
        this.emitChanges('catalog:updated', { products: this.productList });
    }

    public calculateTotalPrice(): number {
        return this.shoppingCart.reduce((total, item) => total + item.price, 0);
    }

    public getItemCountInCart(): number {
        return this.shoppingCart.length;
    }

    public addItemToCart(item: IProductItem): void {
        const foundProduct = this.productList.find(product => product.id === item.id);
        if (foundProduct) {
            this.shoppingCart.push(foundProduct);
            item.inBasket = true;
            this.emitChanges('cart:updated', { cart: this.shoppingCart });
        }
    }

    public removeItemFromCart(item: IProductItem): void {
        this.shoppingCart = this.shoppingCart.filter(product => product.id !== item.id);
        item.inBasket = false;
        this.emitChanges('cart:updated', { cart: this.shoppingCart });
    }

    public previewItem(item: IProductItem): void {
        this.selectedPreview = item.id;
        this.emitChanges('preview:updated', item);
    }

    public updateOrderField(field: keyof IOrderForm, value: string): void {
        this.currentOrder[field] = value;
        if (this.isOrderValid()) {
            this.events.emit('order:valid', this.currentOrder);
        }
    }

    private isOrderValid(): boolean {
        const errors: FormErrors = {};
        if (!this.currentOrder.payment) {
            errors.payment = 'Способ оплаты обязателен';
        }
        if (!this.currentOrder.address) {
            errors.address = 'Адрес обязателен';
        }
        if (!this.currentOrder.email) {
            errors.email = 'Email обязателен';
        }
        if (!this.currentOrder.phone) {
            errors.phone = 'Телефон обязателен';
        }
        this.validationErrors = errors;
        this.events.emit('validationErrors:updated', this.validationErrors);
        return Object.keys(errors).length === 0;
    }

    public clearShoppingCart(): void {
        this.shoppingCart.forEach(item => item.inBasket = false);
        this.shoppingCart = [];
        this.emitChanges('cart:updated', { cart: this.shoppingCart });
    }

    public resetCurrentOrder(): void {
        this.currentOrder = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0,
        };
    }
}
