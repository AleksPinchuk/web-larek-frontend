import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IProductItem } from '../../types';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Ищем элементы и проверяем их наличие
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        // Устанавливаем кнопку как неактивную по умолчанию
        this.setDisabled(this._button, true);

        // Добавляем обработчик клика на кнопку
        this.addButtonClickListener();

        // Инициализируем список элементов корзины
        this.items = [];
    }

    // Устанавливаем элементы корзины
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
        this.isValid(items);
    }

    // Проверяем, есть ли товары в корзине и активируем/деактивируем кнопку
    isValid(items: HTMLElement[]) {
        this.setDisabled(this._button, items.length === 0);
    }

    // Устанавливаем общую сумму корзины
    set total(total: number) {
        if (this._total) {
            this.setText(this._total, `${total} синапсов`);
        }
    }

    // Метод для добавления обработчика клика на кнопку
    private addButtonClickListener() {
        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }
}
