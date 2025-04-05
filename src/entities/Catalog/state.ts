import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from '../../types';
import { Model } from '../../shared/utils/model';

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class CatalogState extends Model<IAppState> {
    basket: IProductItem[] = [];
    catalog: IProductItem[] = [];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
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
        const product = this.findProductInCatalog(item.id);
        if (product) {
            this.updateBasket([...this.basket, product], item);
        }
    }

    removeFromBasket(item: IProductItem) {
        const updatedBasket = this.basket.filter(product => product.id !== item.id);
        this.updateBasket(updatedBasket, item, false);
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: FormErrors = this.validateOrderFields();
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearBasket() {
        this.basket.forEach(item => item.inBasket = false);
        this.basket = [];
    }

    resetOrder() {
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0,
        };
    }

    private findProductInCatalog(id: string): IProductItem | undefined {
        return this.catalog.find(product => product.id === id);
    }

    private updateBasket(newBasket: IProductItem[], item: IProductItem, isAdding: boolean = true) {
        this.basket = newBasket;
        item.inBasket = isAdding;
        this.emitChanges('basket:changed', { basket: this.basket });
    }

    private validateOrderFields(): FormErrors {
        const errors: FormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        return errors;
    }
}
