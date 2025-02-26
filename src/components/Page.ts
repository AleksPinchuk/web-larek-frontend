import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement('.header__basket-counter', container);
        this._catalog = ensureElement('.gallery', container);
        this._wrapper = ensureElement('.page__wrapper', container);
        this._basket = ensureElement('.header__basket', container);

        this._basket.addEventListener('click', () => this.events.emit('basket:open'));
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}
