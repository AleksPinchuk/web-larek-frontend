import { Component } from '../../shared/ui/Component/Component';
import { IEvents } from '../../shared/utils/events';
import { ensureElement } from '../../shared';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Catalog extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this.initializeEventListeners();
	}

	private initializeEventListeners() {
		this._basket.addEventListener('click', this.handleBasketClick.bind(this));
	}

	private handleBasketClick() {
		this.events.emit('basket:open');
	}

	private updateCounter(value: number) {
		this.setText(this._counter, String(value));
	}

	set counter(value: number) {
		this.updateCounter(value);
	}

	set catalog(items: HTMLElement[]) {
		this.updateCatalog(items);
	}

	private updateCatalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleWrapperLock(value);
	}

	private toggleWrapperLock(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
