import { Component } from '../../../../shared/ui/Component/Component';
import { IProduct } from '../../../../types';
import { ensureElement } from '../../../../shared/utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

type CategoryColors = {
    [key: string]: string;
};

const CATEGORY_COLOR_MAP: CategoryColors = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
};

export class ProductCard extends Component<IProduct> {
    private _title: HTMLElement;
    private _price: HTMLElement;
    private _description?: HTMLElement;
    private _category?: HTMLElement;
    private _image?: HTMLImageElement;
    private _button?: HTMLButtonElement;
    private _basketIndex?: HTMLElement;

    constructor(
        container: HTMLElement, 
        protected blockName: string, 
        actions?: ICardActions, 
        inBasket?: boolean
    ) {
        super(container);
        this._initializeElements(container);
        this._initializeActions(actions, inBasket);
    }

    private _initializeElements(container: HTMLElement) {
        this._title = ensureElement<HTMLElement>(`.${this.blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${this.blockName}__price`, container);
        this._category = container.querySelector(`.${this.blockName}__category`);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._image = container.querySelector(`.${this.blockName}__image`);
        this._button = container.querySelector(`.${this.blockName}__button`);
        this._basketIndex = container.querySelector(`.basket__item-index`);
    }

    private _initializeActions(actions?: ICardActions, inBasket?: boolean) {
        if (inBasket) {
            this.setDisabled(this._button, true);
        }

        if (actions?.onClick) {
            this._addClickListener(actions.onClick);
        }
    }

    private _addClickListener(onClick: (event: MouseEvent) => void) {
        if (this._button) {
            this._button.addEventListener('click', onClick);
        } else {
            this.container.addEventListener('click', onClick);
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
        this._category.classList.add(`card__category_${CATEGORY_COLOR_MAP[value]}`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string[] | string) {
        if (Array.isArray(value)) {
            this._replaceDescriptionWithArray(value);
        } else {
            this.setText(this._description, value);
        }
    }

    private _replaceDescriptionWithArray(values: string[]) {
        this._description.replaceWith(...values.map(str => {
            const descTemplate = this._description.cloneNode() as HTMLElement;
            this.setText(descTemplate, str);
            return descTemplate;
        }));
    }

    set basketIndex(value: number) {
        this.setText(this._basketIndex, String(value));
    }
}


