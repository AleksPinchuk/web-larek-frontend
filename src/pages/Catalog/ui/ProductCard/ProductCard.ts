import { Component } from '../../../../shared/ui/Component/Component';
import { IProductItem } from '../../../../types';
import { ensureElement } from '../../../../shared/utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

type CategoryTypes = {
    [key: string]: string;
};

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
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;
    protected _basketIndex?: HTMLElement;

    constructor(
        protected blockName: string,
        container: HTMLElement,
        actions?: ICardActions,
        inBasket?: boolean
    ) {
        super(container);
        this.initializeElements(container);
        this.initializeButton(actions);
        this.setInitialButtonState(inBasket);
    }

    private initializeElements(container: HTMLElement) {
        this._title = ensureElement<HTMLElement>(`.${this.blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${this.blockName}__price`, container);
        this._category = container.querySelector(`.${this.blockName}__category`);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._image = container.querySelector(`.${this.blockName}__image`);
        this._button = container.querySelector(`.${this.blockName}__button`);
        this._basketIndex = container.querySelector(`.basket__item-index`);
    }

    private initializeButton(actions?: ICardActions) {
        if (actions?.onClick) {
            const targetElement = this._button || this.container;
            targetElement.addEventListener('click', actions.onClick);
        }
    }

    private setInitialButtonState(inBasket?: boolean) {
        if (inBasket) {
            this.setDisabled(this._button, true);
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
        this.setDisabled(this._button, value === null);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(`card__category_${categoryTypesColors[value]}`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string[] | string) {
        if (Array.isArray(value)) {
            this.updateDescriptionArray(value);
        } else {
            this.setText(this._description, value);
        }
    }

    private updateDescriptionArray(value: string[]) {
        this._description.replaceWith(
            ...value.map((str) => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            })
        );
    }

    set basketIndex(value: number) {
        this.setText(this._basketIndex, value);
    }
}