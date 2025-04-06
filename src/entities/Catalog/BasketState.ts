import { IProductItem } from '../../types';
import { Model } from '../../shared/utils/model';

export interface IBasketItem extends IProductItem {
    basketId: string;
}

export class BasketState extends Model<{ basket: IBasketItem[] }> {
    basket: IBasketItem[] = [];
    private lastId = 0;

    getTotalBasketPrice(): number {
        return this.basket.reduce((total, product) => total + product.price, 0);
    }

    getBasketItemsCount(): number {
        return this.basket.length;
    }

    addToBasket(item: IProductItem) {
        const basketItem: IBasketItem = {
            ...item,
            basketId: `${item.id}_${++this.lastId}`
        };
        const updatedBasket = [...this.basket, basketItem];
        this.updateBasket(updatedBasket, basketItem);
    }

    removeFromBasket(item: IBasketItem) {
        const updatedBasket = this.basket.filter(product => product.basketId !== item.basketId);
        this.updateBasket(updatedBasket, item, false);
    }

    clearBasket() {
        this.basket.forEach(item => item.inBasket = false);
        this.basket = [];
        this.lastId = 0;
        this.emitChanges('basket:changed', { basket: this.basket });
    }

    private updateBasket(newBasket: IBasketItem[], item: IBasketItem, isAdding: boolean = true) {
        this.basket = newBasket;
        item.inBasket = isAdding;
        this.emitChanges('basket:changed', { basket: this.basket });
    }
} 