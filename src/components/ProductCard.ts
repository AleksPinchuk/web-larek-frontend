import { Component } from './base/Component';
import { IProductItem } from '../types';
import { ensureElement } from '../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

type CategoryTypes = Record<string, string>;

const categoryTypesColors: CategoryTypes = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
};

export class ProductCard extends Component<IProductItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _description: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;
    protected _basketIndex: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions, inBasket = false) {
        super(container);

        this._title = ensureElement(`.${blockName}__title`, container);
        this._price = ensureElement(`.${blockName}__price`, container);
        this._category = ensureElement(`.${blockName}__category`, container);
        this._description = ensureElement(`.${blockName}__text`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);
        this._basketIndex = ensureElement(`.basket__item-index`, container);

        if (inBasket) {
            this.setDisabled(this._button, true);
        }

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number) {
        this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
    }

    set category(value: string) {
        this.setText(this._category, value);
        const className = categoryTypesColors[value];
        if (className) {
            this._category.classList.add(`card__category_${className}`);
        }
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string[] | string) {
        this._description.innerHTML = ''; // Очищаем перед вставкой
        if (Array.isArray(value)) {
            value.forEach(str => {
                const paragraph = document.createElement('p');
                this.setText(paragraph, str);
                this._description.appendChild(paragraph);
            });
        } else {
            this.setText(this._description, value);
        }
    }

    set basketIndex(value: number) {
        this.setText(this._basketIndex, value);
    }
}
