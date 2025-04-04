import { Component } from "../../shared/ui/Component/Component";
import { IEvents } from "../../shared/utils/events";
import { ensureElement } from "../../shared/utils/utils";

interface IPage {
    itemCount: number;
    items: HTMLElement[];
    isLocked: boolean;
}

export class Catalog extends Component<IPage> {
    protected _itemCount: HTMLElement;
    protected _itemsContainer: HTMLElement;
    protected _pageWrapper: HTMLElement;
    protected _basketElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._itemCount = ensureElement<HTMLElement>('.header__basket-counter');
        this._itemsContainer = ensureElement<HTMLElement>('.gallery');
        this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basketElement = ensureElement<HTMLElement>('.header__basket');

        this.setupBasketEvent();
    }

    private setupBasketEvent(): void {
        this._basketElement.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set itemCount(value: number) {
        this.setText(this._itemCount, String(value));
    }

    set items(elements: HTMLElement[]) {
        this._itemsContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
        elements.forEach((element) => {
            this._itemsContainer.appendChild(element);
        });
    }

    set isLocked(value: boolean) {
        this._pageWrapper.classList.toggle('page__wrapper_locked', value);
    }
}